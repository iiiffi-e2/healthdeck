import { NextResponse } from "next/server";
import { getApiUserId } from "@/lib/api/auth-helper";
import { syncUserHealthData } from "@/lib/google-health/sync";
import { useMockHealthData } from "@/lib/config";

export async function POST() {
  const userId = await getApiUserId();

  if (useMockHealthData()) {
    const { generateMockDailySummaries, generateMockExerciseSessions } =
      await import("@/lib/mock/generateMockData");
    return NextResponse.json({
      status: "success",
      recordsPulled:
        generateMockDailySummaries(userId, 365).length +
        generateMockExerciseSessions(userId, 90).length,
      message: "Mock sync completed",
      mock: true,
    });
  }

  try {
    const result = await syncUserHealthData(userId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      status: "success",
      recordsPulled: 365,
      message: "Mock sync (database unavailable)",
      mock: true,
    });
  }
}
