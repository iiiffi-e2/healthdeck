"use client";

import { useState } from "react";
import { Grid, Card, CardContent, Typography, Alert, Box } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { MetricCard } from "@/components/common/MetricCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { HealthDisclaimer } from "@/components/common/HealthDisclaimer";
import { useHealthEndpoint } from "@/hooks/useHealthData";
import type { DateRangeDays } from "@/lib/constants";

interface HeartSummary {
  date: string;
  restingHeartRate?: number;
  avgHeartRate?: number;
  minHeartRate?: number;
  maxHeartRate?: number;
  hrv?: number;
  oxygenSaturation?: number;
  vo2Max?: number;
}

export default function HeartPage() {
  const [range, setRange] = useState<DateRangeDays>(30);
  const { data, loading, error } = useHealthEndpoint("/api/health/heart", range);

  const summaries = (data?.summaries ?? []) as HeartSummary[];
  const latest = summaries[summaries.length - 1];

  const avg = (key: keyof HeartSummary) => {
    const vals = summaries.map((s) => Number(s[key] ?? 0)).filter((v) => v > 0);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  return (
    <>
      <PageHeader
        title="Heart"
        subtitle="Resting HR, HRV, SpO₂, and VO₂ max"
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
        Heart metrics are for wellness tracking only — not medical advice. Consult a
        healthcare professional for clinical concerns.
      </Alert>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 4 }}>
          <MetricCard
            label="Resting HR"
            value={latest?.restingHeartRate ? `${latest.restingHeartRate} bpm` : "—"}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MetricCard label="Avg HR" value={avg("avgHeartRate") ? `${avg("avgHeartRate")} bpm` : "—"} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MetricCard label="HRV" value={latest?.hrv ? `${latest.hrv} ms` : "—"} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MetricCard label="SpO₂" value={latest?.oxygenSaturation ? `${latest.oxygenSaturation}%` : "—"} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MetricCard label="VO₂ max" value={latest?.vo2Max ? String(latest.vo2Max) : "—"} loading={loading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {[
          { title: "Resting heart rate", key: "restingHeartRate" as const, color: "#EF4444", unit: " bpm" },
          { title: "HRV", key: "hrv" as const, color: "#F59E0B", unit: " ms" },
          { title: "Oxygen saturation", key: "oxygenSaturation" as const, color: "#22C55E", unit: "%" },
        ].map((chart) => (
          <Grid key={chart.title} size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: "24px", p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                  {chart.title}
                </Typography>
                <TrendLineChart
                  data={summaries.map((s) => ({
                    date: s.date,
                    value: Number(s[chart.key] ?? 0),
                  }))}
                  color={chart.color}
                  unit={chart.unit}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <HealthDisclaimer />
      </Box>
    </>
  );
}
