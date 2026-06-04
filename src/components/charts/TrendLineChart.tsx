"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Box, Skeleton, Typography } from "@mui/material";
import { format } from "date-fns";

interface TrendLineChartProps {
  data: { date: string; value: number | null }[];
  color?: string;
  unit?: string;
  loading?: boolean;
  height?: number;
}

export function TrendLineChart({
  data,
  color = "#2563EB",
  unit = "",
  loading,
  height = 280,
}: TrendLineChartProps) {
  if (loading) {
    return <Skeleton variant="rounded" height={height} sx={{ borderRadius: 4 }} />;
  }

  if (!data.length) {
    return (
      <Box sx={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">No data for this period</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(new Date(d), "MMM d")}
          tick={{ fill: "#64748B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [`${Number(value ?? 0)}${unit}`, ""]}
          labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
