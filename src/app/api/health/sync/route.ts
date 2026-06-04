import { NextResponse } from "next/server";
import { getApiUserId } from "@/lib/api/auth-helper";
import { syncUserHealthData } from "@/lib/google-health/sync";
import { useMockHealthData } from "@/lib/config";

export async function POST() {
  const userId = await getApiUserId();

  const result = await syncUserHealthData(userId);
  return NextResponse.json({ ...result, mock: useMockHealthData() });
}
