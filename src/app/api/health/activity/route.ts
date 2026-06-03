import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries } from "@/lib/health/data";
import { generateInsights } from "@/lib/insights/generateInsights";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = await getDailySummaries(userId, range);

  let streak = 0;
  for (let i = summaries.length - 1; i >= 0; i--) {
    if ((summaries[i]?.steps ?? 0) >= 8000) streak++;
    else break;
  }

  const recent7 = summaries.slice(-7);
  const prev7 = summaries.slice(-14, -7);
  const stepsRecent = recent7.reduce((a, s) => a + (s.steps ?? 0), 0) / (recent7.length || 1);
  const stepsPrev = prev7.reduce((a, s) => a + (s.steps ?? 0), 0) / (prev7.length || 1);
  const wowChange =
    stepsPrev > 0 ? ((stepsRecent - stepsPrev) / stepsPrev) * 100 : 0;

  return NextResponse.json({
    summaries,
    streak,
    weekOverWeekChange: Math.round(wowChange),
    insights: generateInsights(summaries).filter((i) => i.type === "activity"),
  });
}
