import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries } from "@/lib/health/data";
import { generateInsights } from "@/lib/insights/generateInsights";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = await getDailySummaries(userId, range);
  const withSleep = summaries.filter((s) => (s.sleepMinutes ?? 0) > 0);

  const sorted = [...withSleep].sort(
    (a, b) => (b.sleepMinutes ?? 0) - (a.sleepMinutes ?? 0)
  );

  return NextResponse.json({
    summaries: withSleep,
    best: sorted[0] ?? null,
    worst: sorted[sorted.length - 1] ?? null,
    insights: generateInsights(summaries).filter((i) => i.type === "sleep"),
  });
}
