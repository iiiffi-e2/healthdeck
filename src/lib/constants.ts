export const HEALTH_DISCLAIMER =
  "HealthDeck provides wellness insights only and is not medical advice. Always consult a licensed healthcare professional for medical concerns.";

/** Google Health API OAuth scopes — must match GCP Data Access configuration. */
export const GOOGLE_HEALTH_SCOPES = [
  "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
] as const;

/** @deprecated Use GOOGLE_HEALTH_SCOPES */
export const GOOGLE_HEALTH_SCOPES_PLACEHOLDER = GOOGLE_HEALTH_SCOPES;

export const DATE_RANGE_OPTIONS = [7, 30, 90, 365] as const;
export type DateRangeDays = (typeof DATE_RANGE_OPTIONS)[number];

export const PALETTE = {
  primary: "#2563EB",
  secondary: "#14B8A6",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
} as const;
