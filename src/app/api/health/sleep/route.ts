import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries, getHealthStatus } from "@/lib/health/data";
import { summaryHasSleep } from "@/lib/health/sleep";
import { generateInsights } from "@/lib/insights/generateInsights";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const [summaries, status] = await Promise.all([
    getDailySummaries(userId, range),
    getHealthStatus(userId),
  ]);
  const withSleep = summaries.filter(summaryHasSleep);

  const sorted = [...withSleep].sort(
    (a, b) => (b.sleepMinutes ?? 0) - (a.sleepMinutes ?? 0)
  );

  return NextResponse.json({
    summaries: withSleep,
    best: sorted[0] ?? null,
    worst: sorted[sorted.length - 1] ?? null,
    insights: generateInsights(summaries).filter((i) => i.type === "sleep"),
    connected: status.connected,
    lastSyncedAt: status.lastSyncedAt,
    totalSummaries: summaries.length,
  });
}
