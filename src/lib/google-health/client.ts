import { format, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { decryptToken, encryptToken } from "@/lib/crypto";
import { useMockHealthData } from "@/lib/config";
import { ensureHealthTokens } from "./tokens";
import {
  DAILY_LIST_DATA_TYPES,
  DAILY_ROLLUP_DATA_TYPES,
  ROLLUP_RANGE_DAYS,
  SESSION_LIST_DATA_TYPES,
  type DailyRollupDataType,
} from "./data-types";
import type {
  CivilDate,
  CivilTimeInterval,
  DailyRollupDataPoint,
  HealthDataPoint,
} from "./api-types";

const GOOGLE_HEALTH_API_BASE = "https://health.googleapis.com/v4";

function toCivilDate(d: Date): CivilDate {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
}

function civilRange(start: Date, end: Date): CivilTimeInterval {
  return {
    start: { date: toCivilDate(start) },
    end: { date: toCivilDate(end) },
  };
}

function formatCivilDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export async function refreshGoogleHealthToken(userId: string): Promise<string | null> {
  const connection = await prisma.healthConnection.findUnique({ where: { userId } });
  if (!connection?.encryptedRefreshToken) return null;

  if (useMockHealthData()) {
    return "mock-access-token";
  }

  const refreshToken = decryptToken(connection.encryptedRefreshToken);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  await prisma.healthConnection.update({
    where: { userId },
    data: {
      encryptedAccessToken: encryptToken(data.access_token),
      tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      ...(data.refresh_token
        ? { encryptedRefreshToken: encryptToken(data.refresh_token) }
        : {}),
    },
  });

  return data.access_token;
}

async function getAccessToken(userId: string): Promise<string | null> {
  if (useMockHealthData()) return "mock-access-token";

  await ensureHealthTokens(userId);

  const connection = await prisma.healthConnection.findUnique({ where: { userId } });
  if (!connection?.encryptedAccessToken) return null;

  if (
    connection.tokenExpiresAt &&
    connection.tokenExpiresAt.getTime() < Date.now() + 60_000
  ) {
    return refreshGoogleHealthToken(userId);
  }

  return decryptToken(connection.encryptedAccessToken);
}

async function healthApiFetch(
  userId: string,
  path: string,
  init?: RequestInit
): Promise<Response | null> {
  const token = await getAccessToken(userId);
  if (!token) return null;

  const response = await fetch(`${GOOGLE_HEALTH_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 401) {
    const refreshed = await refreshGoogleHealthToken(userId);
    if (!refreshed) return response;
    return fetch(`${GOOGLE_HEALTH_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${refreshed}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  }

  return response;
}

export async function fetchDailyRollups(
  userId: string,
  dataType: DailyRollupDataType,
  startDate: Date,
  endDate: Date
): Promise<DailyRollupDataPoint[]> {
  if (useMockHealthData()) return [];

  const rangeDays = ROLLUP_RANGE_DAYS[dataType];
  const effectiveStart =
    startDate < subDays(endDate, rangeDays) ? subDays(endDate, rangeDays) : startDate;

  const parent = `users/me/dataTypes/${dataType}`;
  const path = `/v4/${parent}/dataPoints:dailyRollUp`;

  const allPoints: DailyRollupDataPoint[] = [];
  let pageToken: string | undefined;

  do {
    const body = {
      range: civilRange(effectiveStart, endDate),
      windowSizeDays: 1,
      pageSize: 1000,
      ...(pageToken ? { pageToken } : {}),
    };

    const response = await healthApiFetch(userId, path, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response?.ok) {
      const errText = response ? await response.text() : "no token";
      console.error(`Google Health dailyRollUp ${dataType} failed:`, response?.status, errText);
      break;
    }

    const json = (await response.json()) as {
      rollupDataPoints?: DailyRollupDataPoint[];
      nextPageToken?: string;
    };

    if (json.rollupDataPoints?.length) {
      allPoints.push(...json.rollupDataPoints);
    }
    pageToken = json.nextPageToken;
  } while (pageToken);

  return allPoints;
}

export async function listHealthDataPoints(
  userId: string,
  dataType: string,
  startDate: Date,
  endDate: Date
): Promise<HealthDataPoint[]> {
  if (useMockHealthData()) return [];

  const start = formatCivilDate(startDate);
  const end = formatCivilDate(endDate);
  const parent = `users/me/dataTypes/${dataType}`;

  let filter: string;
  if (dataType === "sleep") {
    filter = `sleep.interval.civil_end_time >= "${start}" AND sleep.interval.civil_end_time < "${end}"`;
  } else if (dataType === "exercise") {
    filter = `exercise.interval.civil_start_time >= "${start}" AND exercise.interval.civil_start_time < "${end}"`;
  } else if (dataType === "daily-oxygen-saturation") {
    filter = `dailyOxygenSaturation.date >= "${start}" AND dailyOxygenSaturation.date < "${end}"`;
  } else {
    return [];
  }

  const allPoints: HealthDataPoint[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      filter,
      pageSize: dataType === "sleep" || dataType === "exercise" ? "25" : "100",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await healthApiFetch(
      userId,
      `/v4/${parent}/dataPoints?${params.toString()}`
    );

    if (!response?.ok) {
      console.error(`Google Health list ${dataType} failed:`, response?.status, await response?.text());
      break;
    }

    const json = (await response.json()) as {
      dataPoints?: HealthDataPoint[];
      nextPageToken?: string;
    };

    if (json.dataPoints?.length) {
      allPoints.push(...json.dataPoints);
    }
    pageToken = json.nextPageToken;
  } while (pageToken);

  return allPoints;
}

export async function fetchAllRollupTypes(
  userId: string,
  days: number
): Promise<Map<DailyRollupDataType, DailyRollupDataPoint[]>> {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const result = new Map<DailyRollupDataType, DailyRollupDataPoint[]>();

  for (const dataType of DAILY_ROLLUP_DATA_TYPES) {
    const points = await fetchDailyRollups(userId, dataType, startDate, endDate);
    result.set(dataType, points);
  }

  return result;
}

export async function fetchSessionAndDailyPoints(
  userId: string,
  days: number
): Promise<HealthDataPoint[]> {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const combined: HealthDataPoint[] = [];

  for (const dataType of SESSION_LIST_DATA_TYPES) {
    const points = await listHealthDataPoints(userId, dataType, startDate, endDate);
    combined.push(...points);
  }

  for (const dataType of DAILY_LIST_DATA_TYPES) {
    const points = await listHealthDataPoints(userId, dataType, startDate, endDate);
    combined.push(...points);
  }

  return combined;
}

export async function storeHealthTokens(
  userId: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: Date | null,
  scopes: string[]
): Promise<void> {
  await prisma.healthConnection.upsert({
    where: { userId },
    create: {
      userId,
      encryptedAccessToken: encryptToken(accessToken),
      encryptedRefreshToken: refreshToken ? encryptToken(refreshToken) : null,
      tokenExpiresAt: expiresAt,
      scopes,
    },
    update: {
      encryptedAccessToken: encryptToken(accessToken),
      encryptedRefreshToken: refreshToken ? encryptToken(refreshToken) : null,
      tokenExpiresAt: expiresAt,
      scopes,
    },
  });
}

export { DAILY_ROLLUP_DATA_TYPES, SESSION_LIST_DATA_TYPES, DAILY_LIST_DATA_TYPES };
