/** Latest non-zero numeric value walking backward from the most recent day. */
export function latestNumericMetric<T extends object>(
  summaries: T[],
  key: keyof T
): number | undefined {
  for (let i = summaries.length - 1; i >= 0; i--) {
    const v = summaries[i][key];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  }
  return undefined;
}

export function firstNameFromDisplayName(name?: string | null): string | null {
  if (!name?.trim()) return null;
  const first = name.trim().split(/\s+/)[0];
  return first || null;
}
