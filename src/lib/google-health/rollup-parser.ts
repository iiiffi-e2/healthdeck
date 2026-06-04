import type { DailyRollupDataPoint, CivilDateTime } from "./api-types";
import type { DailySummaryInput } from "./normalize";

export function civilDateTimeToDate(civil?: CivilDateTime): Date | null {
  const d = civil?.date;
  if (!d?.year || !d?.month || !d?.day) return null;
  return new Date(d.year, d.month - 1, d.day);
}

function parseIntString(value?: string): number | null {
  if (value == null || value === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

function parseDurationMinutes(duration?: string): number | null {
  if (!duration) return null;
  const match = /^(\d+(?:\.\d+)?)s$/.exec(duration);
  if (!match) return null;
  return Math.round(Number(match[1]) / 60);
}

export type DailyMetricsPatch = Partial<
  Pick<
    DailySummaryInput,
    | "steps"
    | "calories"
    | "distanceMeters"
    | "activeMinutes"
    | "sleepMinutes"
    | "deepSleepMinutes"
    | "remSleepMinutes"
    | "lightSleepMinutes"
    | "awakeMinutes"
    | "restingHeartRate"
    | "avgHeartRate"
    | "minHeartRate"
    | "maxHeartRate"
    | "hrv"
    | "oxygenSaturation"
    | "vo2Max"
    | "weightKg"
  >
>;

export function parseRollupToMetrics(point: DailyRollupDataPoint): {
  date: Date;
  patch: DailyMetricsPatch;
} | null {
  const date = civilDateTimeToDate(point.civilStartTime);
  if (!date) return null;

  const patch: DailyMetricsPatch = {};

  if (point.steps?.countSum != null) {
    patch.steps = parseIntString(point.steps.countSum);
  }

  if (point.heartRate) {
    patch.avgHeartRate = point.heartRate.beatsPerMinuteAvg ?? null;
    patch.minHeartRate = point.heartRate.beatsPerMinuteMin ?? null;
    patch.maxHeartRate = point.heartRate.beatsPerMinuteMax ?? null;
  }

  if (point.restingHeartRatePersonalRange) {
    const { beatsPerMinuteMin, beatsPerMinuteMax } =
      point.restingHeartRatePersonalRange;
    if (beatsPerMinuteMin != null && beatsPerMinuteMax != null) {
      patch.restingHeartRate = Math.round((beatsPerMinuteMin + beatsPerMinuteMax) / 2);
    }
  }

  if (point.heartRateVariabilityPersonalRange) {
    const { averageHeartRateVariabilityMillisecondsMin, averageHeartRateVariabilityMillisecondsMax } =
      point.heartRateVariabilityPersonalRange;
    if (
      averageHeartRateVariabilityMillisecondsMin != null &&
      averageHeartRateVariabilityMillisecondsMax != null
    ) {
      patch.hrv = Math.round(
        (averageHeartRateVariabilityMillisecondsMin +
          averageHeartRateVariabilityMillisecondsMax) /
          2
      );
    }
  }

  if (point.activeMinutes?.activeMinutesRollupByActivityLevel?.length) {
    let total = 0;
    for (const level of point.activeMinutes.activeMinutesRollupByActivityLevel) {
      total += parseIntString(level.activeMinutesSum) ?? 0;
    }
    patch.activeMinutes = total > 0 ? total : null;
  }

  if (point.distance?.millimetersSum != null) {
    const mm = Number(point.distance.millimetersSum);
    patch.distanceMeters = Number.isFinite(mm) ? mm / 1000 : null;
  }

  if (point.totalCalories?.kcalSum != null) {
    patch.calories = point.totalCalories.kcalSum;
  }

  if (point.weight?.weightGramsAvg != null) {
    patch.weightKg = point.weight.weightGramsAvg / 1000;
  }

  if (point.runVo2Max?.rateAvg != null) {
    patch.vo2Max = point.runVo2Max.rateAvg;
  }

  return { date, patch };
}

export { parseDurationMinutes, parseIntString };
