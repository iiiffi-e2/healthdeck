import { prisma } from "@/lib/prisma";
import { GOOGLE_HEALTH_SCOPES } from "@/lib/constants";
import { storeHealthTokens } from "./client";

export type GoogleOAuthTokens = {
  access_token?: string | null;
  refresh_token?: string | null;
  expires_at?: number | null;
  scope?: string | null;
};

function parseScopes(scope: string | null | undefined): string[] {
  if (!scope) return [...GOOGLE_HEALTH_SCOPES];
  return scope.split(/\s+/).filter(Boolean);
}

function expiresAtFromAccount(account: Pick<GoogleOAuthTokens, "expires_at">): Date | null {
  if (account.expires_at == null) return null;
  return new Date(account.expires_at * 1000);
}

export async function syncHealthTokensFromGoogleAccount(
  userId: string,
  account: GoogleOAuthTokens
): Promise<void> {
  if (!account.access_token) return;

  await storeHealthTokens(
    userId,
    account.access_token,
    account.refresh_token ?? null,
    expiresAtFromAccount(account),
    parseScopes(account.scope)
  );
}

/** Copy Google OAuth tokens from Auth.js Account into HealthConnection when missing. */
export async function ensureHealthTokens(userId: string): Promise<boolean> {
  const connection = await prisma.healthConnection.findUnique({
    where: { userId },
  });
  if (connection?.encryptedAccessToken) return true;

  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });
  if (!account?.access_token) return false;

  await syncHealthTokensFromGoogleAccount(userId, account);
  return true;
}
