"use client";

import { useState } from "react";
import { Grid, Card, CardContent, Typography, Alert } from "@mui/material";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { MetricCard } from "@/components/common/MetricCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { SleepStagesChart } from "@/components/charts/SleepStagesChart";
import { InsightCard } from "@/components/common/InsightCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useHealthEndpoint } from "@/hooks/useHealthData";
import type { DateRangeDays } from "@/lib/constants";
import { formatMinutes } from "@/lib/health/data";

interface SleepSummary {
  date: string;
  sleepMinutes?: number;
  deepSleepMinutes?: number;
  remSleepMinutes?: number;
  lightSleepMinutes?: number;
  awakeMinutes?: number;
  sleepScore?: number;
}

export default function SleepPage() {
  const [range, setRange] = useState<DateRangeDays>(30);
  const { data, loading, error } = useHealthEndpoint("/api/health/sleep", range);

  const summaries = (data?.summaries ?? []) as SleepSummary[];
  const best = data?.best as SleepSummary | null;
  const worst = data?.worst as SleepSummary | null;
  const insights = (data?.insights ?? []) as { message: string }[];
  const latest = summaries[summaries.length - 1];

  if (!loading && !summaries.length) {
    return (
      <>
        <PageHeader title="Sleep" subtitle="Duration, stages, and trends" />
        <EmptyState
          title="No sleep data yet"
          description="Connect Google Health and sync to see your sleep trends."
          actionLabel="Connect account"
          onAction={() => (window.location.href = "/connect")}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Sleep"
        subtitle="Duration, stages, and sleep score"
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard
            label="Last night"
            value={formatMinutes(latest?.sleepMinutes)}
            subtext={latest?.sleepScore ? `Score: ${latest.sleepScore}` : undefined}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard
            label="Best night"
            value={best ? formatMinutes(best.sleepMinutes) : "—"}
            subtext={best ? format(new Date(best.date), "MMM d") : undefined}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard
            label="Shortest night"
            value={worst ? formatMinutes(worst.sleepMinutes) : "—"}
            subtext={worst ? format(new Date(worst.date), "MMM d") : undefined}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: "24px", p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Sleep duration trend
              </Typography>
              <TrendLineChart
                data={summaries.map((s) => ({
                  date: s.date,
                  value: s.sleepMinutes ?? 0,
                }))}
                color="#8B5CF6"
                unit=" min"
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: "24px", p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Sleep stages
              </Typography>
              <SleepStagesChart
                loading={loading}
                data={summaries.slice(-14).map((s) => ({
                  date: s.date,
                  deep: s.deepSleepMinutes ?? 0,
                  rem: s.remSleepMinutes ?? 0,
                  light: s.lightSleepMinutes ?? 0,
                  awake: s.awakeMinutes ?? 0,
                }))}
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
