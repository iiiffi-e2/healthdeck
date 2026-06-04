"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Grid, Card, CardContent, Typography, Box, Alert } from "@mui/material";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TimerIcon from "@mui/icons-material/Timer";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AirIcon from "@mui/icons-material/Air";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { InsightCard } from "@/components/common/InsightCard";
import { SyncButton } from "@/components/dashboard/SyncButton";
import { useHealthEndpoint } from "@/hooks/useHealthData";
import type { DateRangeDays } from "@/lib/constants";
import { formatMinutes, formatNumber } from "@/lib/health/data";
import {
  firstNameFromDisplayName,
  latestNumericMetric,
} from "@/lib/health/dashboard-metrics";

interface SummaryRow {
  date: string;
  steps?: number;
  sleepMinutes?: number;
  restingHeartRate?: number;
  activeMinutes?: number;
  hrv?: number;
  oxygenSaturation?: number;
}

export default function DashboardPage() {
  const [range, setRange] = useState<DateRangeDays>(30);
  const { data: session } = useSession();
  const { data, loading, error, refetch } = useHealthEndpoint("/api/health/summary", range);

  const summaries = (data?.summaries ?? []) as SummaryRow[];
  const latestSteps = latestNumericMetric(summaries, "steps");
  const latestSleep = latestNumericMetric(summaries, "sleepMinutes");
  const latestRhr = latestNumericMetric(summaries, "restingHeartRate");
  const latestActive = latestNumericMetric(summaries, "activeMinutes");
  const latestHrv = latestNumericMetric(summaries, "hrv");
  const latestSpo2 = latestNumericMetric(summaries, "oxygenSaturation");
  const insightCards = data?.insightCards as
    | { sleep: string; heart: string; activity: string }
    | undefined;
  const status = data?.status as { lastSyncedAt?: string; mockMode?: boolean } | undefined;

  const chartData = (key: keyof SummaryRow, color: string) => ({
    data: summaries.map((s) => {
      const v = s[key];
      return {
        date: s.date,
        value: typeof v === "number" && Number.isFinite(v) ? v : null,
      };
    }),
    color,
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = firstNameFromDisplayName(session?.user?.name);
  const title = firstName
    ? `${greeting()}, ${firstName} 👋`
    : `${greeting()} 👋`;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          status?.lastSyncedAt
            ? `Last synced ${format(new Date(status.lastSyncedAt), "PPp")}${status.mockMode ? " · Demo data" : ""}`
            : "Sync your Google Health data to get started"
        }
        actions={
          <>
            <DateRangeSelector value={range} onChange={setRange} />
            <SyncButton onSynced={refetch} />
          </>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            label="Steps today"
            value={formatNumber(latestSteps)}
            icon={<DirectionsWalkIcon />}
            color="#2563EB"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            label="Sleep last night"
            value={formatMinutes(latestSleep)}
            icon={<BedtimeIcon />}
            color="#8B5CF6"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            label="Resting heart rate"
            value={latestRhr ? `${latestRhr} bpm` : "—"}
            icon={<FavoriteIcon />}
            color="#EF4444"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            label="Active minutes"
            value={formatNumber(latestActive, " min")}
            icon={<TimerIcon />}
            color="#14B8A6"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            label="HRV"
            value={latestHrv ? `${latestHrv} ms` : "—"}
            icon={<MonitorHeartIcon />}
            color="#F59E0B"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            label="Oxygen saturation"
            value={latestSpo2 ? `${latestSpo2}%` : "—"}
            icon={<AirIcon />}
            color="#22C55E"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Steps trend", ...chartData("steps", "#2563EB"), unit: "" },
          { title: "Sleep duration", ...chartData("sleepMinutes", "#8B5CF6"), unit: " min" },
          { title: "Resting heart rate", ...chartData("restingHeartRate", "#EF4444"), unit: " bpm" },
          { title: "Active minutes", ...chartData("activeMinutes", "#14B8A6"), unit: " min" },
        ].map((chart) => (
          <Grid key={chart.title} size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "24px", p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                  {chart.title}
                </Typography>
                <TrendLineChart
                  data={chart.data}
                  color={chart.color}
                  unit={chart.unit}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Insights
      </Typography>
      <Grid container spacing={2}>
        {(insightCards
          ? [insightCards.sleep, insightCards.heart, insightCards.activity]
          : []
        ).map((message, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <InsightCard message={message} />
          </Grid>
        ))}
        {loading &&
          [0, 1, 2].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Box sx={{ height: 100, bgcolor: "action.hover", borderRadius: 4 }} />
            </Grid>
          ))}
      </Grid>
    </>
  );
}
