"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import { HEALTH_DISCLAIMER } from "@/lib/constants";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/config";

interface LegalPageShellProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        {title}
      </Typography>
      <Box
        sx={{
          color: "text.primary",
          "& p": { mb: 2, lineHeight: 1.75 },
          "& ul, & ol": { pl: 3, mb: 2, lineHeight: 1.75 },
          "& li": { mb: 0.75 },
          "& a": { color: "primary.main" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(248, 250, 252, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "text.primary",
            }}
          >
            <MonitorHeartOutlinedIcon color="primary" />
            <Typography sx={{ fontWeight: 700 }}>HealthDeck</Typography>
          </Box>
          <Button component={Link} href="/connect" variant="contained" size="small">
            Sign in
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Last updated: {LEGAL_LAST_UPDATED}
        </Typography>

        {children}

        <Divider sx={{ my: 5 }} />

        <Box sx={{ p: 2.5, bgcolor: "action.hover", borderRadius: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {HEALTH_DISCLAIMER}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button component={Link} href="/" variant="outlined">
            ← Home
          </Button>
          <Button component={Link} href="/privacy" size="small">
            Privacy Policy
          </Button>
          <Button component={Link} href="/terms" size="small">
            Terms & Conditions
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
