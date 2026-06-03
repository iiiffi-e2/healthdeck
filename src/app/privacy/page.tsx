"use client";

import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import { HEALTH_DISCLAIMER } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
        Privacy Policy
      </Typography>
      <Typography sx={{ mb: 2 }} color="text.secondary">
        Last updated: June 3, 2026
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
        Data we collect
      </Typography>
      <Typography sx={{ mb: 2 }}>
        When you connect Google Health, HealthDeck stores encrypted OAuth tokens and
        synced wellness metrics (steps, sleep, heart rate, activity, and exercise) to
        power your dashboard.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
        How we use your data
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Your data is used solely to display trends, generate wellness insights, and
        produce exports you request. We do not sell your health data.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
        Your controls
      </Typography>
      <Typography sx={{ mb: 2 }}>
        You can export or delete your data anytime from Settings. Disconnecting Google
        revokes future syncs.
      </Typography>

      <Box sx={{ mt: 4, p: 2, bgcolor: "action.hover", borderRadius: 3 }}>
        <Typography variant="body2">{HEALTH_DISCLAIMER}</Typography>
      </Box>

      <Button component={Link} href="/" sx={{ mt: 4 }}>
        ← Home
      </Button>
    </Container>
  );
}
