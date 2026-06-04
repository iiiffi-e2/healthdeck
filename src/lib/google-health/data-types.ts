/** Google Health API v4 data type path segments (users/me/dataTypes/{id}). */
export const DAILY_ROLLUP_DATA_TYPES = [
  "steps",
  "heart-rate",
  "daily-resting-heart-rate",
  "daily-heart-rate-variability",
  "active-minutes",
  "distance",
  "total-calories",
  "weight",
  "run-vo2-max",
] as const;

export type DailyRollupDataType = (typeof DAILY_ROLLUP_DATA_TYPES)[number];

/** Max civil-time range for dailyRollUp (API limits). */
export const ROLLUP_RANGE_DAYS: Record<DailyRollupDataType, number> = {
  steps: 90,
  "heart-rate": 14,
  "daily-resting-heart-rate": 90,
  "daily-heart-rate-variability": 90,
  "active-minutes": 14,
  distance: 90,
  "total-calories": 14,
  weight: 90,
  "run-vo2-max": 90,
};

export const SESSION_LIST_DATA_TYPES = ["sleep", "exercise"] as const;
export const DAILY_LIST_DATA_TYPES = ["daily-oxygen-saturation"] as const;
