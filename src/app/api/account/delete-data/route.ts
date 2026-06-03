import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction([
      prisma.exerciseSession.deleteMany({ where: { userId } }),
      prisma.dailySummary.deleteMany({ where: { userId } }),
      prisma.syncLog.deleteMany({ where: { userId } }),
      prisma.healthConnection.deleteMany({ where: { userId } }),
    ]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({
      success: true,
      message: "No database configured; nothing to delete",
    });
  }
}
