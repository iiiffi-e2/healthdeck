"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import { HealthDisclaimer } from "@/components/common/HealthDisclaimer";
import { GOOGLE_HEALTH_SCOPES } from "@/lib/constants";

export default function ConnectPage() {
  const sessionQuery = useSession();
  const session = sessionQuery?.data;
  const status = sessionQuery?.status ?? "loading";
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #2563EB, #14B8A6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              mb: 2,
            }}
          >
            <MonitorHeartOutlinedIcon fontSize="large" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Connect Google Health
          </Typography>
          <Typography color="text.secondary">
            Sign in with Google to authorize HealthDeck. We&apos;ll request access to your
            wellness data when the Google Health API is enabled.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: "28px", mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <List dense>
              {[
                "Secure Google OAuth sign-in",
                "Encrypted token storage",
                "Sync sleep, heart, activity & exercise",
                "Export CSV & PDF reports",
              ].map((text) => (
                <ListItem key={text} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlinedIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              disabled={status === "loading" || !!session}
              sx={{ mt: 2, py: 1.5 }}
            >
              Continue with Google
            </Button>

            <Button
              fullWidth
              component={Link}
              href="/dashboard"
              sx={{ mt: 1.5 }}
            >
              Continue with demo data
            </Button>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
          Requested scopes: {GOOGLE_HEALTH_SCOPES.join(", ")}
        </Typography>

        <HealthDisclaimer />

        <Button component={Link} href="/" sx={{ mt: 3 }} color="inherit">
          ← Back to home
        </Button>
      </Container>
    </Box>
  );
}
