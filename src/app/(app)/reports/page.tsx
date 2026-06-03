"use client";

import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";
import { HealthDisclaimer } from "@/components/common/HealthDisclaimer";
import type { DateRangeDays } from "@/lib/constants";

export default function ReportsPage() {
  const [range, setRange] = useState<DateRangeDays>(30);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const exportUrl = (type: "csv" | "pdf") => {
    const params = new URLSearchParams({ range: String(range) });
    if (customStart && customEnd) {
      params.set("start", customStart);
      params.set("end", customEnd);
    }
    return `/api/reports/${type}?${params}`;
  };

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Generate and export wellness summaries"
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: "24px", height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Report preview
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Your {range}-day wellness report includes average steps, sleep duration,
                resting heart rate, and activity trends. Exports include the standard
                wellness disclaimer.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<TableChartIcon />}
                  href={exportUrl("csv")}
                  component="a"
                >
                  Export CSV
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  href={exportUrl("pdf")}
                  component="a"
                >
                  Export PDF
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: "24px" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                Custom date range
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Optional — preset ranges above apply to quick exports.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                <TextField
                  label="Start"
                  type="date"
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <TextField
                  label="End"
                  type="date"
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HealthDisclaimer />
        </Grid>
      </Grid>
    </>
  );
}
