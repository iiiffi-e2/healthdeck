import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries } from "@/lib/health/data";
import { generateInsights } from "@/lib/insights/generateInsights";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = await getDailySummaries(userId, range);

  return NextResponse.json({
    summaries,
    irregularRhythmNotifications: useMockIrregular(),
    insights: generateInsights(summaries).filter((i) => i.type === "heart"),
  });
}

function useMockIrregular(): { date: string; notified: boolean }[] {
  return [];
}
