import type { DailySummary } from "@prisma/client";

/** True if a daily summary row has any sleep-related metrics stored. */
export function summaryHasSleep(s: Pick<
  DailySummary,
  | "sleepMinutes"
  | "deepSleepMinutes"
  | "remSleepMinutes"
  | "lightSleepMinutes"
  | "awakeMinutes"
>): boolean {
  return (
    (s.sleepMinutes ?? 0) > 0 ||
    (s.deepSleepMinutes ?? 0) > 0 ||
    (s.remSleepMinutes ?? 0) > 0 ||
    (s.lightSleepMinutes ?? 0) > 0 ||
    (s.awakeMinutes ?? 0) > 0
  );
}
