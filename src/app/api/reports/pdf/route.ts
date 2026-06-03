import { NextRequest, NextResponse } from "next/server";
import { getApiUserId, parseRange } from "@/lib/api/auth-helper";
import { getDailySummaries } from "@/lib/health/data";
import { generatePdf } from "@/lib/reports/export";

export async function GET(request: NextRequest) {
  const userId = await getApiUserId();
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = await getDailySummaries(userId, range);
  const pdfBytes = await generatePdf(summaries, range);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="healthdeck-${range}d.pdf"`,
    },
  });
}
