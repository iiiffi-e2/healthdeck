import type { DailySummary, ExerciseSession, Prisma } from "@prisma/client";
import type { RawHealthPayload } from "./types";

export type DailySummaryInput = Omit<
  DailySummary,
  "id" | "createdAt" | "updatedAt"
>;

export type ExerciseSessionInput = Omit<
  ExerciseSession,
  "id" | "createdAt" | "updatedAt"
>;

export function normalizeDailySummary(
  userId: string,
  date: Date,
  rawData: RawHealthPayload
): DailySummaryInput {
  const agg = rawData.dataPoints?.reduce(
    (acc, dp) => {
      acc[dp.dataType] = typeof dp.value === "number" ? dp.value : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    userId,
    date,
    steps: agg?.steps ?? null,
    calories: agg?.nutrition ?? null,
    distanceMeters: null,
    activeMinutes: null,
    sleepMinutes: agg?.sleep ?? null,
    deepSleepMinutes: null,
    remSleepMinutes: null,
    lightSleepMinutes: null,
    awakeMinutes: null,
    sleepScore: null,
    restingHeartRate: agg?.["resting-heart-rate"] ?? null,
    avgHeartRate: agg?.["heart-rate"] ?? null,
    minHeartRate: null,
    maxHeartRate: null,
    hrv: agg?.["heart-rate-variability"] ?? null,
    oxygenSaturation: agg?.["oxygen-saturation"] ?? null,
    vo2Max: agg?.["vo2-max"] ?? null,
    weightKg: agg?.weight ?? null,
    source: rawData.source ?? "google-health",
    raw: rawData as Prisma.JsonValue,
  };
}

export function normalizeExerciseSessions(
  userId: string,
  rawData: RawHealthPayload
): ExerciseSessionInput[] {
  if (!rawData.sessions?.length) return [];

  return rawData.sessions.map((session, index) => {
    const s = session as Record<string, unknown>;
    return {
      userId,
      date: new Date((s.date as string) ?? Date.now()),
      type: String(s.type ?? "exercise"),
      title: String(s.title ?? `Workout ${index + 1}`),
      durationMinutes: Number(s.durationMinutes ?? 30),
      calories: s.calories != null ? Number(s.calories) : null,
      distanceMeters: s.distanceMeters != null ? Number(s.distanceMeters) : null,
      avgHeartRate: s.avgHeartRate != null ? Number(s.avgHeartRate) : null,
      raw: s as Prisma.JsonValue,
    };
  });
}
