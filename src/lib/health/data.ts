import { subDays, startOfDay } from "date-fns";
import type { DailySummary, ExerciseSession } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { useMockHealthData } from "@/lib/config";
import {
  generateMockDailySummaries,
  generateMockExerciseSessions,
} from "@/lib/mock/generateMockData";

const DEMO_USER_ID = "demo-user";

export async function resolveUserId(sessionUserId?: string): Promise<string> {
  return sessionUserId ?? DEMO_USER_ID;
}

export async function getDailySummaries(
  userId: string,
  rangeDays: number
): Promise<DailySummary[]> {
  const since = startOfDay(subDays(new Date(), rangeDays));

  if (useMockHealthData()) {
    const mock = generateMockDailySummaries(userId, rangeDays);
    return mock.map((m, i) => ({
      ...m,
      id: `mock-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as DailySummary[];
  }

  try {
    return await prisma.dailySummary.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getExerciseSessions(
  userId: string,
  rangeDays: number
): Promise<ExerciseSession[]> {
  const since = startOfDay(subDays(new Date(), rangeDays));

  if (useMockHealthData()) {
    const mock = generateMockExerciseSessions(userId, rangeDays);
    return mock.map((m, i) => ({
      ...m,
      id: `mock-ex-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as ExerciseSession[];
  }

  try {
    return await prisma.exerciseSession.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getHealthStatus(userId: string) {
  try {
    const connection = await prisma.healthConnection.findUnique({
      where: { userId },
    });
    const lastSync = await prisma.syncLog.findFirst({
      where: { userId, status: "success" },
      orderBy: { finishedAt: "desc" },
    });
    return {
      connected: Boolean(connection),
      lastSyncedAt: connection?.lastSyncedAt ?? lastSync?.finishedAt ?? null,
      scopes: connection?.scopes ?? [],
      mockMode: useMockHealthData(),
    };
  } catch {
    return {
      connected: false,
      lastSyncedAt: null,
      scopes: [],
      mockMode: useMockHealthData(),
    };
  }
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function formatNumber(n: number | null | undefined, suffix = ""): string {
  if (n == null) return "—";
  return `${Math.round(n).toLocaleString()}${suffix}`;
}
