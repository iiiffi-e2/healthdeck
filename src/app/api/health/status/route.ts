import { NextResponse } from "next/server";
import { getApiUserId } from "@/lib/api/auth-helper";
import { getHealthStatus } from "@/lib/health/data";

export async function GET() {
  const userId = await getApiUserId();
  const status = await getHealthStatus(userId);
  return NextResponse.json(status);
}
