import type { DailySummary } from "@prisma/client";

export interface WellnessInsight {
  id: string;
  type: "sleep" | "heart" | "activity" | "general";
  message: string;
  sentiment: "positive" | "neutral" | "caution";
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function generateInsights(summaries: DailySummary[]): WellnessInsight[] {
  const insights: WellnessInsight[] = [];
  if (summaries.length < 7) {
    insights.push({
      id: "insufficient-data",
      type: "general",
      message: "Connect and sync your Google Health data to unlock personalized wellness insights.",
      sentiment: "neutral",
    });
    return insights;
  }

  const sorted = [...summaries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const recent7 = sorted.slice(-7);
  const previous30 = sorted.slice(-37, -7);
  const last30 = sorted.slice(-30);

  const sleepRecent = average(
    recent7.map((s) => s.sleepMinutes ?? 0).filter((v) => v > 0)
  );
  const sleepPrev = average(
    previous30.map((s) => s.sleepMinutes ?? 0).filter((v) => v > 0)
  );
  if (sleepRecent > 0 && sleepPrev > 0) {
    const diff = Math.round(sleepRecent - sleepPrev);
    if (Math.abs(diff) >= 15) {
      insights.push({
        id: "sleep-trend",
        type: "sleep",
        message:
          diff < 0
            ? `Your average sleep duration is lower than the previous 30 days (about ${Math.abs(diff)} minutes less per night).`
            : `Your average sleep duration is higher than the previous 30 days (about ${diff} minutes more per night).`,
        sentiment: diff < 0 ? "caution" : "positive",
      });
    } else {
      insights.push({
        id: "sleep-stable",
        type: "sleep",
        message: "Your sleep duration has been fairly consistent compared to your recent baseline.",
        sentiment: "neutral",
      });
    }
  }

  const rhrRecent = average(
    recent7.map((s) => s.restingHeartRate ?? 0).filter((v) => v > 0)
  );
  const rhrPrev = average(
    last30.map((s) => s.restingHeartRate ?? 0).filter((v) => v > 0)
  );
  if (rhrRecent > 0 && rhrPrev > 0) {
    const delta = Math.abs(rhrRecent - rhrPrev);
    insights.push({
      id: "rhr-trend",
      type: "heart",
      message:
        delta <= 3
          ? "Your resting heart rate has stayed within your usual range."
          : rhrRecent > rhrPrev
            ? "Your resting heart rate has been slightly higher than your 30-day average this week."
            : "Your resting heart rate has been slightly lower than your 30-day average this week.",
      sentiment: "neutral",
    });
  }

  const activeRecent = average(recent7.map((s) => s.activeMinutes ?? 0));
  const activePrev = average(
    sorted.slice(-14, -7).map((s) => s.activeMinutes ?? 0)
  );
  if (activeRecent > 0 && activePrev > 0) {
    const change = percentChange(activeRecent, activePrev);
    if (Math.abs(change) >= 8) {
      insights.push({
        id: "activity-wow",
        type: "activity",
        message:
          change > 0
            ? `Your active minutes increased about ${Math.round(change)}% week over week.`
            : `Your active minutes decreased about ${Math.abs(Math.round(change))}% week over week.`,
        sentiment: change > 0 ? "positive" : "neutral",
      });
    }
  }

  const stepsRecent = average(recent7.map((s) => s.steps ?? 0));
  const stepsAvg30 = average(last30.map((s) => s.steps ?? 0));
  if (stepsRecent > stepsAvg30 * 1.1) {
    insights.push({
      id: "steps-up",
      type: "activity",
      message: "Your step count this week is above your 30-day average.",
      sentiment: "positive",
    });
  }

  if (!insights.length) {
    insights.push({
      id: "default",
      type: "general",
      message: "Keep syncing your data regularly to track trends across sleep, heart, and activity.",
      sentiment: "neutral",
    });
  }

  return insights;
}

export function getDashboardInsightCards(summaries: DailySummary[]): {
  sleep: string;
  heart: string;
  activity: string;
} {
  const insights = generateInsights(summaries);
  const sleep =
    insights.find((i) => i.type === "sleep")?.message ??
    "Sleep insights will appear after your next sync.";
  const heart =
    insights.find((i) => i.type === "heart")?.message ??
    "Resting heart rate is stable.";
  const activity =
    insights.find((i) => i.type === "activity")?.message ??
    "Activity trends will appear after your next sync.";

  return { sleep, heart, activity };
}
