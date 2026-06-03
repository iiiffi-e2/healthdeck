import { addDays, startOfDay, subDays } from "date-fns";
import type { DailySummary, ExerciseSession } from "@prisma/client";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateMockDailySummaries(
  userId: string,
  days: number
): Omit<DailySummary, "id" | "createdAt" | "updatedAt">[] {
  const rand = seededRandom(userId.length * 997 + days);
  const summaries: Omit<DailySummary, "id" | "createdAt" | "updatedAt">[] = [];
  const today = startOfDay(new Date());

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const steps = Math.round(6000 + rand() * 8000 + (weekend ? -1500 : 500));
    const sleepMinutes = Math.round(360 + rand() * 120);
    const deep = Math.round(sleepMinutes * (0.18 + rand() * 0.08));
    const rem = Math.round(sleepMinutes * (0.22 + rand() * 0.06));
    const light = Math.round(sleepMinutes * 0.45);
    const awake = Math.max(0, sleepMinutes - deep - rem - light);

    summaries.push({
      userId,
      date,
      steps,
      calories: Math.round(steps * 0.04 + rand() * 200),
      distanceMeters: steps * 0.75,
      activeMinutes: Math.round(25 + rand() * 55),
      sleepMinutes,
      deepSleepMinutes: deep,
      remSleepMinutes: rem,
      lightSleepMinutes: light,
      awakeMinutes: awake,
      sleepScore: Math.round(65 + rand() * 30),
      restingHeartRate: Math.round(58 + rand() * 12),
      avgHeartRate: Math.round(72 + rand() * 18),
      minHeartRate: Math.round(48 + rand() * 8),
      maxHeartRate: Math.round(140 + rand() * 35),
      hrv: Math.round((35 + rand() * 25) * 10) / 10,
      oxygenSaturation: Math.round((96 + rand() * 3) * 10) / 10,
      vo2Max: Math.round((38 + rand() * 12) * 10) / 10,
      weightKg: Math.round((70 + rand() * 8) * 10) / 10,
      source: "mock-google-health",
      raw: { mock: true, date: date.toISOString() },
    });
  }

  return summaries;
}

export function generateMockExerciseSessions(
  userId: string,
  days: number
): Omit<ExerciseSession, "id" | "createdAt" | "updatedAt">[] {
  const rand = seededRandom(userId.length * 431 + days);
  const types = ["Running", "Walking", "Cycling", "Strength", "Yoga", "Swimming"];
  const sessions: Omit<ExerciseSession, "id" | "createdAt" | "updatedAt">[] = [];
  const today = startOfDay(new Date());

  for (let i = 0; i < Math.min(days, 45); i++) {
    if (rand() > 0.55) continue;
    const date = subDays(today, Math.floor(rand() * days));
    const type = types[Math.floor(rand() * types.length)]!;
    const durationMinutes = Math.round(20 + rand() * 50);
    sessions.push({
      userId,
      date,
      type,
      title: `${type} workout`,
      durationMinutes,
      calories: Math.round(durationMinutes * (4 + rand() * 6)),
      distanceMeters: type === "Strength" || type === "Yoga" ? null : Math.round(durationMinutes * 80 * rand()),
      avgHeartRate: Math.round(110 + rand() * 40),
      raw: { mock: true },
    });
  }

  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getMockLastSyncedAt(): Date {
  return subDays(new Date(), 0);
}

export function addTrendDates<T extends { date: Date }>(
  items: T[],
  days: number
): T[] {
  if (items.length >= days) return items.slice(-days);
  return items;
}
