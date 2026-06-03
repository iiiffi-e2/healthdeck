import { NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { storeHealthTokens } from "@/lib/google-health/client";
import { GOOGLE_HEALTH_SCOPES_PLACEHOLDER } from "@/lib/constants";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Exchange OAuth code for Google Health tokens when API is finalized
  if (process.env.USE_MOCK_HEALTH_DATA !== "false") {
    await storeHealthTokens(
      session.user.id,
      "mock-access-token",
      "mock-refresh-token",
      new Date(Date.now() + 3600 * 1000),
      GOOGLE_HEALTH_SCOPES_PLACEHOLDER
    );
    return NextResponse.json({ connected: true, mock: true });
  }

  return NextResponse.json({
    message: "Redirect to Google OAuth for Health API authorization",
    signInUrl: "/api/auth/signin/google",
  });
}
