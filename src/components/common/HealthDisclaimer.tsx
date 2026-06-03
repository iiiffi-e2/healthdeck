"use client";

import { Alert, Typography } from "@mui/material";
import { HEALTH_DISCLAIMER } from "@/lib/constants";

interface HealthDisclaimerProps {
  compact?: boolean;
}

export function HealthDisclaimer({ compact }: HealthDisclaimerProps) {
  if (compact) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
        {HEALTH_DISCLAIMER}
      </Typography>
    );
  }

  return (
    <Alert severity="info" sx={{ borderRadius: 3 }}>
      {HEALTH_DISCLAIMER}
    </Alert>
  );
}
