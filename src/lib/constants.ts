export const HEALTH_DISCLAIMER =
  "HealthDeck provides wellness insights only and is not medical advice. Always consult a licensed healthcare professional for medical concerns.";

export const GOOGLE_HEALTH_SCOPES_PLACEHOLDER = [
  // TODO: Finalize Google Health API OAuth scopes when credentials are available
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
];

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
