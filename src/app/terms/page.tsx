"use client";

import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import { HEALTH_DISCLAIMER } from "@/lib/constants";

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
        Terms of Service
      </Typography>
      <Typography sx={{ mb: 2 }} color="text.secondary">
        Last updated: June 3, 2026
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
        Service description
      </Typography>
      <Typography sx={{ mb: 2 }}>
        HealthDeck is a wellness dashboard for Google Health-compatible devices. The
        service is provided as-is during the MVP period.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
        Not medical advice
      </Typography>
      <Typography sx={{ mb: 2 }}>{HEALTH_DISCLAIMER}</Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
        Acceptable use
      </Typography>
      <Typography sx={{ mb: 2 }}>
        You agree to use HealthDeck for personal wellness tracking only and to comply
        with Google&apos;s API terms when connecting your account.
      </Typography>

      <Box sx={{ mt: 4, p: 2, bgcolor: "action.hover", borderRadius: 3 }}>
        <Typography variant="body2">
          By using HealthDeck, you acknowledge that health metrics may be inaccurate
          and should not be used for diagnosis or treatment decisions.
        </Typography>
      </Box>

      <Button component={Link} href="/" sx={{ mt: 4 }}>
        ← Home
      </Button>
    </Container>
  );
}
