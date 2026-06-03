import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries, getExerciseSessions } from "@/lib/health/data";
import { generateCsv } from "@/lib/reports/export";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = await getDailySummaries(userId, range);
  const exercises = await getExerciseSessions(userId, range);
  const csv = generateCsv(summaries, exercises);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="healthdeck-${range}d.csv"`,
    },
  });
}
