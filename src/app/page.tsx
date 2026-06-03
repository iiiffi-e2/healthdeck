"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import { HealthDisclaimer } from "@/components/common/HealthDisclaimer";

const FEATURES = [
  {
    title: "Sleep trends",
    description: "Track duration, stages, and scores over 7–365 days.",
    icon: <BedtimeOutlinedIcon />,
    color: "#2563EB",
  },
  {
    title: "Heart insights",
    description: "Resting HR, HRV, SpO₂, and VO₂ max in one view.",
    icon: <FavoriteBorderOutlinedIcon />,
    color: "#EF4444",
  },
  {
    title: "Activity dashboard",
    description: "Steps, active minutes, calories, and streaks.",
    icon: <DirectionsRunOutlinedIcon />,
    color: "#14B8A6",
  },
  {
    title: "Doctor-ready reports",
    description: "Share wellness summaries with your care team.",
    icon: <DescriptionOutlinedIcon />,
    color: "#8B5CF6",
  },
  {
    title: "CSV/PDF exports",
    description: "Download your data anytime you need it.",
    icon: <FileDownloadOutlinedIcon />,
    color: "#F59E0B",
  },
  {
    title: "Privacy-first controls",
    description: "You own your data. Delete it with one click.",
    icon: <SecurityOutlinedIcon />,
    color: "#22C55E",
  },
];

export default function LandingPage() {
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MonitorHeartOutlinedIcon color="primary" />
            <Typography sx={{ fontWeight: 700 }} color="text.primary">
              HealthDeck
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} href="/connect" color="inherit">
              Sign in
            </Button>
            <Button component={Link} href="/connect" variant="contained">
              Connect Google Health
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.25rem", md: "3.25rem" },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                Your Google Health data, finally built for the web.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.7 }}>
                Connect Fitbit, Pixel Watch, and Google Health data to explore sleep, heart,
                activity, and exercise trends from a clean desktop dashboard.
              </Typography>
              <Button
                component={Link}
                href="/connect"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Connect Google Health
              </Button>
              <Button
                component={Link}
                href="/dashboard"
                size="large"
                sx={{ ml: 2 }}
              >
                View demo dashboard
              </Button>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  borderRadius: "28px",
                  p: 2,
                  background: "linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)",
                }}
              >
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Today&apos;s snapshot
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {[
                      { label: "Steps", value: "9,842" },
                      { label: "Sleep", value: "7h 24m" },
                      { label: "Resting HR", value: "62 bpm" },
                      { label: "Active", value: "48 min" },
                    ].map((m) => (
                      <Grid key={m.label} size={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "20px",
                            bgcolor: "background.default",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {m.label}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {m.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 10, mb: 4 }}>
          Everything you need in one dashboard
        </Typography>
        <Grid container spacing={3}>
          {FEATURES.map((f, i) => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    borderRadius: "24px",
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(15,23,42,0.1)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "16px",
                        bgcolor: `${f.color}18`,
                        color: f.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                      {f.title}
                    </Typography>
                    <Typography color="text.secondary">{f.description}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8 }}>
          <HealthDisclaimer />
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Typography component={Link} href="/privacy" variant="body2" color="text.secondary">
            Privacy
          </Typography>
          <Typography component={Link} href="/terms" variant="body2" color="text.secondary">
            Terms
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
