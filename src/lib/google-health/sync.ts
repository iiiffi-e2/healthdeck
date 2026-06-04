import { prisma } from "@/lib/prisma";
import { toPrismaJson } from "@/lib/prisma-json";
import { useMockHealthData } from "@/lib/config";
import {
  generateMockDailySummaries,
  generateMockExerciseSessions,
} from "@/lib/mock/generateMockData";
import { fetchAllRollupTypes, fetchSessionAndDailyPoints } from "./client";
import { parseRollupToMetrics, type DailyMetricsPatch } from "./rollup-parser";
import {
  applyPatchToMap,
  mergeDailyPatches,
  parseExerciseDataPoint,
  parseOxygenDataPoint,
  parseSleepDataPoint,
} from "./normalize";
import { ensureHealthTokens } from "./tokens";

const SYNC_DAYS = 90;

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
      const hasTokens = await ensureHealthTokens(userId);
      if (!hasTokens) {
        throw new Error(
          "No Google Health tokens. Sign in with Google again to grant health data access."
        );
      }

      const byDate = new Map<string, DailyMetricsPatch>();

      const rollupsByType = await fetchAllRollupTypes(userId, SYNC_DAYS);
      for (const points of rollupsByType.values()) {
        for (const point of points) {
          const parsed = parseRollupToMetrics(point);
          if (parsed) applyPatchToMap(byDate, parsed.date, parsed.patch);
        }
      }

      const listPoints = await fetchSessionAndDailyPoints(userId, SYNC_DAYS);
      for (const point of listPoints) {
        const sleep = parseSleepDataPoint(point);
        if (sleep) applyPatchToMap(byDate, sleep.date, sleep.patch);

        const oxygen = parseOxygenDataPoint(point);
        if (oxygen) applyPatchToMap(byDate, oxygen.date, oxygen.patch);
      }

      const summaries = mergeDailyPatches(userId, byDate);
      for (const summary of summaries) {
        const data = mapSummaryForPrisma(summary);
        await prisma.dailySummary.upsert({
          where: { userId_date: { userId, date: summary.date } },
          create: data,
          update: data,
        });
        recordsPulled++;
      }

      await prisma.exerciseSession.deleteMany({ where: { userId } });
      const sessions = listPoints
        .map((p) => parseExerciseDataPoint(userId, p))
        .filter((s): s is NonNullable<typeof s> => s != null)
        .map(mapSummaryForPrisma);

      if (sessions.length) {
        await prisma.exerciseSession.createMany({ data: sessions });
        recordsPulled += sessions.length;
      }
    }

    await prisma.healthConnection.updateMany({
      where: { userId },
      data: { lastSyncedAt: new Date() },
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
