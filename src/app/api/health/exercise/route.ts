import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getExerciseSessions } from "@/lib/health/data";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const exercises = await getExerciseSessions(userId, range);

  return NextResponse.json({ exercises });
}
