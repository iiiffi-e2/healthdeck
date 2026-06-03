"use client";

import { useState } from "react";
import { Grid, Card, CardContent, Typography, Alert } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { MetricCard } from "@/components/common/MetricCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { InsightCard } from "@/components/common/InsightCard";
import { useHealthEndpoint } from "@/hooks/useHealthData";
import type { DateRangeDays } from "@/lib/constants";
import { formatNumber } from "@/lib/health/data";

interface ActivitySummary {
  date: string;
  steps?: number;
  activeMinutes?: number;
  calories?: number;
  distanceMeters?: number;
}

export default function ActivityPage() {
  const [range, setRange] = useState<DateRangeDays>(30);
  const { data, loading, error } = useHealthEndpoint("/api/health/activity", range);

  const summaries = (data?.summaries ?? []) as ActivitySummary[];
  const streak = (data?.streak as number) ?? 0;
  const wow = (data?.weekOverWeekChange as number) ?? 0;
  const insights = (data?.insights ?? []) as { message: string }[];
  const latest = summaries[summaries.length - 1];

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle="Steps, active minutes, calories, and distance"
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Steps today" value={formatNumber(latest?.steps)} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label="Active minutes"
            value={formatNumber(latest?.activeMinutes, " min")}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Calories" value={formatNumber(latest?.calories)} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label="Distance"
            value={
              latest?.distanceMeters
                ? `${(latest.distanceMeters / 1000).toFixed(1)} km`
                : "—"
            }
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label="Step streak"
            value={`${streak} days`}
            subtext="8,000+ steps"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label="Week over week"
            value={`${wow >= 0 ? "+" : ""}${wow}%`}
            subtext="Steps comparison"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: "24px", p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Steps trend
              </Typography>
              <TrendLineChart
                data={summaries.map((s) => ({ date: s.date, value: s.steps ?? 0 }))}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: "24px", p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Active minutes
              </Typography>
              <TrendLineChart
                data={summaries.map((s) => ({ date: s.date, value: s.activeMinutes ?? 0 }))}
                color="#14B8A6"
                unit=" min"
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>
        {insights[0] && (
          <Grid size={{ xs: 12 }}>
            <InsightCard message={insights[0].message} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
