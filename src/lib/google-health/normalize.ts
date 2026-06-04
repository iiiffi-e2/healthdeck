import type { DailySummary, ExerciseSession, Prisma } from "@prisma/client";
import { format, parse } from "date-fns";
import type { CivilDate, HealthDataPoint } from "./api-types";
import {
  civilDateTimeToDate,
  parseDurationMinutes,
  parseIntString,
  type DailyMetricsPatch,
} from "./rollup-parser";

export type DailySummaryInput = Omit<
  DailySummary,
  "id" | "createdAt" | "updatedAt"
>;

export type ExerciseSessionInput = Omit<
  ExerciseSession,
  "id" | "createdAt" | "updatedAt"
>;

function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function minutesBetweenTimestamps(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms <= 0) return null;
  return Math.round(ms / 60_000);
}

function applySleepStageMinutes(
  patch: DailyMetricsPatch,
  type: string | undefined,
  minutes: number
): void {
  switch (type) {
    case "DEEP":
      patch.deepSleepMinutes = (patch.deepSleepMinutes ?? 0) + minutes;
      break;
    case "REM":
      patch.remSleepMinutes = (patch.remSleepMinutes ?? 0) + minutes;
      break;
    case "LIGHT":
      patch.lightSleepMinutes = (patch.lightSleepMinutes ?? 0) + minutes;
      break;
    case "AWAKE":
      patch.awakeMinutes = (patch.awakeMinutes ?? 0) + minutes;
      break;
    default:
      break;
  }
}

function dateFromCivilDate(d?: CivilDate): Date | null {
  if (!d?.year || !d?.month || !d?.day) return null;
  return new Date(d.year, d.month - 1, d.day);
}

export function mergeDailyPatches(
  userId: string,
  byDate: Map<string, DailyMetricsPatch>
): DailySummaryInput[] {
  return Array.from(byDate.entries()).map(([key, patch]) => ({
    userId,
    date: parse(key, "yyyy-MM-dd", new Date()),
    steps: patch.steps ?? null,
    calories: patch.calories ?? null,
    distanceMeters: patch.distanceMeters ?? null,
    activeMinutes: patch.activeMinutes ?? null,
    sleepMinutes: patch.sleepMinutes ?? null,
    deepSleepMinutes: patch.deepSleepMinutes ?? null,
    remSleepMinutes: patch.remSleepMinutes ?? null,
    lightSleepMinutes: patch.lightSleepMinutes ?? null,
    awakeMinutes: patch.awakeMinutes ?? null,
    sleepScore: null,
    restingHeartRate: patch.restingHeartRate ?? null,
    avgHeartRate: patch.avgHeartRate ?? null,
    minHeartRate: patch.minHeartRate ?? null,
    maxHeartRate: patch.maxHeartRate ?? null,
    hrv: patch.hrv ?? null,
    oxygenSaturation: patch.oxygenSaturation ?? null,
    vo2Max: patch.vo2Max ?? null,
    weightKg: patch.weightKg ?? null,
    source: "google-health",
    raw: patch as unknown as Prisma.JsonValue,
  }));
}

export function applyPatchToMap(
  map: Map<string, DailyMetricsPatch>,
  date: Date,
  patch: DailyMetricsPatch
): void {
  const key = dateKey(date);
  const existing = map.get(key) ?? {};
  map.set(key, { ...existing, ...patch });
}

export function parseSleepDataPoint(point: HealthDataPoint): {
  date: Date;
  patch: DailyMetricsPatch;
} | null {
  const sleep = point.sleep;
  if (!sleep?.interval) return null;

  const date =
    civilDateTimeToDate(sleep.interval.civilEndTime) ??
    civilDateTimeToDate(sleep.interval.civilStartTime);
  if (!date) return null;

  const patch: DailyMetricsPatch = {};

  if (sleep.summary) {
    patch.sleepMinutes = parseIntString(sleep.summary.minutesAsleep);
    patch.awakeMinutes = parseIntString(sleep.summary.minutesAwake);

    if (patch.sleepMinutes == null) {
      patch.sleepMinutes = parseIntString(sleep.summary.minutesInSleepPeriod);
    }

    for (const stage of sleep.summary.stagesSummary ?? []) {
      const minutes = parseIntString(stage.minutes) ?? 0;
      if (minutes > 0) applySleepStageMinutes(patch, stage.type, minutes);
    }
  }

  for (const stage of sleep.stages ?? []) {
    const minutes = minutesBetweenTimestamps(stage.startTime, stage.endTime);
    if (minutes != null && minutes > 0) {
      applySleepStageMinutes(patch, stage.type, minutes);
    }
  }

  if (patch.sleepMinutes == null) {
    const intervalMinutes = minutesBetweenTimestamps(
      sleep.interval.startTime,
      sleep.interval.endTime
    );
    if (intervalMinutes != null) patch.sleepMinutes = intervalMinutes;
  }

  if (patch.sleepMinutes == null) {
    const stageTotal =
      (patch.deepSleepMinutes ?? 0) +
      (patch.remSleepMinutes ?? 0) +
      (patch.lightSleepMinutes ?? 0);
    if (stageTotal > 0) patch.sleepMinutes = stageTotal;
  }

  const hasData =
    (patch.sleepMinutes ?? 0) > 0 ||
    (patch.deepSleepMinutes ?? 0) > 0 ||
    (patch.remSleepMinutes ?? 0) > 0 ||
    (patch.lightSleepMinutes ?? 0) > 0 ||
    (patch.awakeMinutes ?? 0) > 0;

  return hasData ? { date, patch } : null;
}

export function parseOxygenDataPoint(point: HealthDataPoint): {
  date: Date;
  patch: DailyMetricsPatch;
} | null {
  const o2 = point.dailyOxygenSaturation;
  const date = dateFromCivilDate(o2?.date);
  if (!date) return null;
  return {
    date,
    patch: { oxygenSaturation: o2?.averagePercentage ?? null },
  };
}

export function parseRestingHeartRateDataPoint(point: HealthDataPoint): {
  date: Date;
  patch: DailyMetricsPatch;
} | null {
  const rhr = point.dailyRestingHeartRate;
  const date = dateFromCivilDate(rhr?.date);
  if (!date || !rhr?.beatsPerMinute) return null;
  const bpm = Number.parseInt(rhr.beatsPerMinute, 10);
  return {
    date,
    patch: { restingHeartRate: Number.isFinite(bpm) ? bpm : null },
  };
}

export function parseHeartRateVariabilityDataPoint(point: HealthDataPoint): {
  date: Date;
  patch: DailyMetricsPatch;
} | null {
  const hrv = point.dailyHeartRateVariability;
  const date = dateFromCivilDate(hrv?.date);
  if (!date || hrv?.averageHeartRateVariabilityMilliseconds == null) return null;
  return {
    date,
    patch: { hrv: Math.round(hrv.averageHeartRateVariabilityMilliseconds) },
  };
}

export function parseExerciseDataPoint(
  userId: string,
  point: HealthDataPoint
): ExerciseSessionInput | null {
  const ex = point.exercise;
  if (!ex?.displayName) return null;

  const date = civilDateTimeToDate(ex.interval?.civilStartTime) ?? new Date();
  const durationMinutes = parseDurationMinutes(ex.activeDuration) ?? 30;

  const metrics = ex.metricsSummary;

  return {
    userId,
    date,
    type: (ex.exerciseType ?? "WORKOUT").toLowerCase().replace(/_/g, "-"),
    title: ex.displayName,
    durationMinutes,
    calories: metrics?.caloriesKcal ?? null,
    distanceMeters:
      metrics?.distanceMillimeters != null
        ? metrics.distanceMillimeters / 1000
        : null,
    avgHeartRate: metrics?.averageHeartRateBeatsPerMinute
      ? Number.parseInt(metrics.averageHeartRateBeatsPerMinute, 10)
      : null,
    raw: ex as unknown as Prisma.JsonValue,
  };
}

/** @deprecated Used for mock pipeline only */
export function normalizeDailySummary(
  userId: string,
  date: Date,
  rawData: { dataPoints?: Array<{ dataType: string; value: number }>; source?: string }
): DailySummaryInput {
  const agg = rawData.dataPoints?.reduce(
    (acc, dp) => {
      acc[dp.dataType] = dp.value;
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
    raw: rawData as unknown as Prisma.JsonValue,
  };
}

export function normalizeExerciseSessions(
  userId: string,
  rawData: { sessions?: Record<string, unknown>[] }
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
