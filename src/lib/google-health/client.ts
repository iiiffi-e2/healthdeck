import { prisma } from "@/lib/prisma";
import { decryptToken, encryptToken } from "@/lib/crypto";
import { useMockHealthData } from "@/lib/config";
import type { GoogleHealthDataType, GoogleHealthDataPoint, GoogleHealthDailyRollup } from "./types";

// TODO: Replace with finalized Google Health API base URL and endpoints
const GOOGLE_HEALTH_API_BASE = "https://health.googleapis.com/v1";

export async function refreshGoogleHealthToken(userId: string): Promise<string | null> {
  const connection = await prisma.healthConnection.findUnique({ where: { userId } });
  if (!connection?.encryptedRefreshToken) return null;

  if (useMockHealthData()) {
    return "mock-access-token";
  }

  const refreshToken = decryptToken(connection.encryptedRefreshToken);

  // TODO: POST to Google OAuth token endpoint with refresh_token grant
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
  const connection = await prisma.healthConnection.findUnique({ where: { userId } });
  if (!connection) return null;

  if (
    connection.tokenExpiresAt &&
    connection.tokenExpiresAt.getTime() < Date.now() + 60_000
  ) {
    return refreshGoogleHealthToken(userId);
  }

  if (useMockHealthData()) return "mock-access-token";
  return decryptToken(connection.encryptedAccessToken);
}

export async function getGoogleHealthDataPoints(
  userId: string,
  dataType: GoogleHealthDataType,
  startTime: string,
  endTime: string
): Promise<GoogleHealthDataPoint[]> {
  if (useMockHealthData()) return [];

  const token = await getAccessToken(userId);
  if (!token) return [];

  // TODO: Map dataType to Google Health API resource path
  const url = `${GOOGLE_HEALTH_API_BASE}/users/me/dataSources/${dataType}/dataPointChanges?startTime=${startTime}&endTime=${endTime}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return [];
  const json = (await response.json()) as { dataPoints?: GoogleHealthDataPoint[] };
  return json.dataPoints ?? [];
}

export async function getGoogleHealthDailyRollup(
  userId: string,
  dataType: GoogleHealthDataType,
  startDate: string,
  endDate: string
): Promise<GoogleHealthDailyRollup[]> {
  if (useMockHealthData()) return [];

  const token = await getAccessToken(userId);
  if (!token) return [];

  const url = `${GOOGLE_HEALTH_API_BASE}/users/me/dataset/${dataType}/daily?startDate=${startDate}&endDate=${endDate}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return [];
  const json = (await response.json()) as { rollups?: GoogleHealthDailyRollup[] };
  return json.rollups ?? [];
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
      encryptedRefreshToken: refreshToken ? encryptToken(refreshToken) : undefined,
      tokenExpiresAt: expiresAt,
      scopes,
    },
  });
}
