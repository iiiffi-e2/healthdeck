"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@mui/material";
import { format } from "date-fns";

interface SleepStagesChartProps {
  data: {
    date: string;
    deep: number;
    rem: number;
    light: number;
    awake: number;
  }[];
  loading?: boolean;
}

export function SleepStagesChart({ data, loading }: SleepStagesChartProps) {
  if (loading) {
    return <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(new Date(d), "MMM d")}
          tick={{ fill: "#64748B", fontSize: 12 }}
        />
        <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
        <Tooltip labelFormatter={(l) => format(new Date(l), "MMM d, yyyy")} />
        <Legend />
        <Bar dataKey="deep" stackId="a" fill="#2563EB" name="Deep" radius={[0, 0, 0, 0]} />
        <Bar dataKey="rem" stackId="a" fill="#14B8A6" name="REM" />
        <Bar dataKey="light" stackId="a" fill="#94A3B8" name="Light" />
        <Bar dataKey="awake" stackId="a" fill="#F59E0B" name="Awake" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
