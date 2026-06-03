"use client";

import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { EmptyState } from "@/components/common/EmptyState";
import { useHealthEndpoint } from "@/hooks/useHealthData";
import type { DateRangeDays } from "@/lib/constants";

interface ExerciseRow {
  id?: string;
  date: string;
  type: string;
  title: string;
  durationMinutes: number;
  calories?: number;
  distanceMeters?: number;
  avgHeartRate?: number;
}

export default function ExercisePage() {
  const [range, setRange] = useState<DateRangeDays>(30);
  const { data, loading, error } = useHealthEndpoint("/api/health/exercise", range);

  const exercises = (data?.exercises ?? []) as ExerciseRow[];

  const trendByWeek = exercises.reduce(
    (acc, e) => {
      const week = format(new Date(e.date), "MMM d");
      acc[week] = (acc[week] ?? 0) + e.durationMinutes;
      return acc;
    },
    {} as Record<string, number>
  );

  const chartData = Object.entries(trendByWeek).map(([date, value]) => ({ date, value }));

  if (!loading && !exercises.length) {
    return (
      <>
        <PageHeader title="Exercise" subtitle="Workouts and training trends" />
        <EmptyState
          title="No workouts recorded"
          description="Sync your Google Health data to see exercise sessions from Fitbit or Pixel Watch."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Exercise"
        subtitle="Workouts and training trends"
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: "24px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Training minutes by day
              </Typography>
              <TrendLineChart data={chartData} color="#2563EB" unit=" min" loading={loading} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: "24px" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Avg HR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exercises.map((row, i) => (
                <TableRow key={row.id ?? i} hover>
                  <TableCell>{format(new Date(row.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Chip label={row.type} size="small" />
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell align="right">{row.durationMinutes} min</TableCell>
                  <TableCell align="right">{row.calories ?? "—"}</TableCell>
                  <TableCell align="right">
                    {row.avgHeartRate ? `${row.avgHeartRate} bpm` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}
