"use client";

import { useCallback, useEffect, useState } from "react";
import type { DateRangeDays } from "@/lib/constants";

export function useHealthEndpoint<T = Record<string, unknown>>(
  endpoint: string,
  range: DateRangeDays
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}?range=${range}`);
      if (!res.ok) throw new Error("Failed to load health data");
      const json = (await res.json()) as T;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
