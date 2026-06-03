import { startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { toPrismaJson } from "@/lib/prisma-json";
import { useMockHealthData } from "@/lib/config";
import {
  generateMockDailySummaries,
  generateMockExerciseSessions,
} from "@/lib/mock/generateMockData";
import { normalizeDailySummary, normalizeExerciseSessions } from "./normalize";
import { getGoogleHealthDailyRollup } from "./client";
import type { GoogleHealthDataType } from "./types";

const PRIORITY_DATA_TYPES: GoogleHealthDataType[] = [
  "steps",
  "heart-rate",
  "resting-heart-rate",
  "heart-rate-variability",
  "oxygen-saturation",
  "sleep",
  "exercise",
  "weight",
  "vo2-max",
];

function mapSummaryForPrisma<T extends { raw?: unknown }>(summary: T) {
  return { ...summary, raw: toPrismaJson(summary.raw as never) };
}

export async function syncUserHealthData(userId: string): Promise<{
  status: "success" | "error";
  recordsPulled: number;
  message: string;
}> {
  const syncLog = await prisma.syncLog.create({
    data: { userId, status: "running", message: "Sync started" },
  });

  try {
    let recordsPulled = 0;

    if (useMockHealthData()) {
      const days = 365;
      const summaries = generateMockDailySummaries(userId, days);
      const exercises = generateMockExerciseSessions(userId, days);

      for (const summary of summaries) {
        const data = mapSummaryForPrisma(summary);
        await prisma.dailySummary.upsert({
          where: {
            userId_date: { userId: summary.userId, date: summary.date },
          },
          create: data,
          update: data,
        });
        recordsPulled++;
      }

      await prisma.exerciseSession.deleteMany({ where: { userId } });
      if (exercises.length) {
        await prisma.exerciseSession.createMany({
          data: exercises.map(mapSummaryForPrisma),
        });
        recordsPulled += exercises.length;
      }
    } else {
      const endDate = new Date().toISOString().split("T")[0]!;
      const startDate = subDays(new Date(), 90).toISOString().split("T")[0]!;

      for (const dataType of PRIORITY_DATA_TYPES) {
        const rollups = await getGoogleHealthDailyRollup(
          userId,
          dataType,
          startDate,
          endDate
        );
        for (const rollup of rollups) {
          const date = startOfDay(new Date(rollup.date));
          const normalized = mapSummaryForPrisma(
            normalizeDailySummary(userId, date, {
              dataPoints: [
                {
                  dataType,
                  startTime: rollup.date,
                  endTime: rollup.date,
                  value: Object.values(rollup.aggregate)[0] ?? 0,
                },
              ],
              source: "google-health",
            })
          );
          await prisma.dailySummary.upsert({
            where: { userId_date: { userId, date } },
            create: normalized,
            update: normalized,
          });
          recordsPulled++;
        }
      }

      // TODO: Fetch exercise sessions from Google Health API exercise endpoint
      const exerciseRaw = { sessions: [] };
      const sessions = normalizeExerciseSessions(userId, exerciseRaw).map(
        mapSummaryForPrisma
      );
      if (sessions.length) {
        await prisma.exerciseSession.createMany({ data: sessions });
        recordsPulled += sessions.length;
      }
    }

    await prisma.healthConnection.upsert({
      where: { userId },
      create: {
        userId,
        encryptedAccessToken: "",
        scopes: [],
        lastSyncedAt: new Date(),
      },
      update: { lastSyncedAt: new Date() },
    });

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        recordsPulled,
        message: "Sync completed successfully",
      },
    });

    return { status: "success", recordsPulled, message: "Sync completed" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "error",
        finishedAt: new Date(),
        message,
      },
    });
    return { status: "error", recordsPulled: 0, message };
  }
}
