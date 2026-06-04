/** Google Health API v4 data types that support dailyRollUp. */
export const DAILY_ROLLUP_DATA_TYPES = [
  "steps",
  "heart-rate",
  "active-minutes",
  "distance",
  "total-calories",
  "weight",
  "run-vo2-max",
] as const;

export type DailyRollupDataType = (typeof DAILY_ROLLUP_DATA_TYPES)[number];

/**
 * Max days per dailyRollUp request: windowSizeDays * pageSize must not exceed this.
 * @see https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/dailyRollUp
 */
export const ROLLUP_MAX_QUERY_DAYS: Record<DailyRollupDataType, number> = {
  steps: 90,
  "heart-rate": 14,
  "active-minutes": 14,
  distance: 90,
  "total-calories": 14,
  weight: 90,
  "run-vo2-max": 90,
};

/** Daily summary types — use list (not dailyRollUp). */
export const DAILY_LIST_DATA_TYPES = [
  "daily-resting-heart-rate",
  "daily-heart-rate-variability",
  "daily-oxygen-saturation",
] as const;

export type DailyListDataType = (typeof DAILY_LIST_DATA_TYPES)[number];

export const SESSION_LIST_DATA_TYPES = ["sleep", "exercise"] as const;
