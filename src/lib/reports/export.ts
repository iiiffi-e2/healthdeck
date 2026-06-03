import { format } from "date-fns";
import type { DailySummary, ExerciseSession } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { HEALTH_DISCLAIMER } from "@/lib/constants";

export function generateCsv(
  summaries: DailySummary[],
  exercises: ExerciseSession[]
): string {
  const headers = [
    "date",
    "steps",
    "calories",
    "distanceMeters",
    "activeMinutes",
    "sleepMinutes",
    "restingHeartRate",
    "avgHeartRate",
    "hrv",
    "oxygenSaturation",
    "vo2Max",
  ];
  const rows = summaries.map((s) =>
    [
      format(new Date(s.date), "yyyy-MM-dd"),
      s.steps ?? "",
      s.calories ?? "",
      s.distanceMeters ?? "",
      s.activeMinutes ?? "",
      s.sleepMinutes ?? "",
      s.restingHeartRate ?? "",
      s.avgHeartRate ?? "",
      s.hrv ?? "",
      s.oxygenSaturation ?? "",
      s.vo2Max ?? "",
    ].join(",")
  );

  const exerciseHeaders = [
    "date",
    "type",
    "title",
    "durationMinutes",
    "calories",
    "distanceMeters",
    "avgHeartRate",
  ];
  const exerciseRows = exercises.map((e) =>
    [
      format(new Date(e.date), "yyyy-MM-dd"),
      e.type,
      `"${e.title}"`,
      e.durationMinutes,
      e.calories ?? "",
      e.distanceMeters ?? "",
      e.avgHeartRate ?? "",
    ].join(",")
  );

  return [
    "# HealthDeck Export",
    "# " + HEALTH_DISCLAIMER,
    "",
    headers.join(","),
    ...rows,
    "",
    "# Exercise Sessions",
    exerciseHeaders.join(","),
    ...exerciseRows,
  ].join("\n");
}

export async function generatePdf(
  summaries: DailySummary[],
  rangeDays: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  let y = 750;

  const draw = (text: string, size = 11, useBold = false) => {
    page.drawText(text, {
      x: 50,
      y,
      size,
      font: useBold ? bold : font,
      color: rgb(0.06, 0.09, 0.16),
      maxWidth: 512,
    });
    y -= size + 8;
  };

  draw("HealthDeck Wellness Report", 20, true);
  draw(`Period: last ${rangeDays} days · Generated ${format(new Date(), "PPP")}`, 10);
  y -= 8;

  const avgSteps =
    summaries.reduce((a, s) => a + (s.steps ?? 0), 0) / (summaries.length || 1);
  const avgSleep =
    summaries.reduce((a, s) => a + (s.sleepMinutes ?? 0), 0) / (summaries.length || 1);
  const avgRhr =
    summaries.reduce((a, s) => a + (s.restingHeartRate ?? 0), 0) / (summaries.length || 1);

  draw("Summary", 14, true);
  draw(`Average steps: ${Math.round(avgSteps).toLocaleString()}`);
  draw(`Average sleep: ${Math.round(avgSleep / 60)}h ${Math.round(avgSleep % 60)}m`);
  draw(`Average resting heart rate: ${Math.round(avgRhr)} bpm`);
  y -= 8;
  draw(HEALTH_DISCLAIMER, 9);

  return doc.save();
}
