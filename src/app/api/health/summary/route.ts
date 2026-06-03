import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries, getHealthStatus } from "@/lib/health/data";
import { generateInsights, getDashboardInsightCards } from "@/lib/insights/generateInsights";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = await getDailySummaries(userId, range);
  const status = await getHealthStatus(userId);
  const insights = generateInsights(summaries);
  const cards = getDashboardInsightCards(summaries);

  const latest = summaries[summaries.length - 1];

  return NextResponse.json({
    summaries,
    status,
    insights,
    insightCards: cards,
    today: latest ?? null,
  });
}
