import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { useMockHealthData } from "@/lib/config";
import { storeHealthTokens } from "@/lib/google-health/client";
import { ensureHealthTokens } from "@/lib/google-health/tokens";
import { GOOGLE_HEALTH_SCOPES } from "@/lib/constants";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useMockHealthData()) {
    await storeHealthTokens(
      session.user.id,
      "mock-access-token",
      "mock-refresh-token",
      new Date(Date.now() + 3600 * 1000),
      [...GOOGLE_HEALTH_SCOPES]
    );
    return NextResponse.json({ connected: true, mock: true });
  }

  const connected = await ensureHealthTokens(session.user.id);
  if (!connected) {
    return NextResponse.json(
      {
        error: "No Google tokens found. Sign in with Google from the connect page.",
        signInUrl: "/api/auth/signin/google",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ connected: true, mock: false });
}
