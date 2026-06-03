import { Prisma } from "@prisma/client";
import type { Prisma as PrismaNamespace } from "@prisma/client";

export function toPrismaJson(
  value: PrismaNamespace.JsonValue | null | undefined
): PrismaNamespace.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === null) return Prisma.JsonNull;
  if (value === undefined) return undefined;
  return value as PrismaNamespace.InputJsonValue;
}
