import { auth } from "@/lib/auth";
import { resolveUserId } from "@/lib/health/data";

export async function getApiUserId(): Promise<string> {
  const session = await auth();
  return resolveUserId(session?.user?.id);
}

export function parseRange(searchParams: URLSearchParams): number {
  const range = parseInt(searchParams.get("range") ?? "30", 10);
  if ([7, 30, 90, 365].includes(range)) return range;
  return 30;
}
