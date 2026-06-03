"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Box,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { SyncButton } from "@/components/dashboard/SyncButton";
import Link from "next/link";

export default function SettingsPage() {
  const session = useSession();
  const sessionUser = session?.data;
  const [status, setStatus] = useState<{
    lastSyncedAt?: string;
    mockMode?: boolean;
    scopes?: string[];
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health/status")
      .then((r) => r.json())
      .then(setStatus);
  }, []);

  const deleteData = async () => {
    if (!confirm("Delete all synced health data? This cannot be undone.")) return;
    const res = await fetch("/api/account/delete-data", { method: "DELETE" });
    if (res.ok) setMessage("Your health data has been deleted.");
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Account, sync, and privacy" />

      {message && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          {message}
        </Alert>
      )}

      <Card sx={{ borderRadius: "24px", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
            Connected Google account
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={sessionUser?.user?.name ?? "Demo user"}
                secondary={sessionUser?.user?.email ?? "Not signed in — using demo data"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Last sync"
                secondary={
                  status?.lastSyncedAt
                    ? format(new Date(status.lastSyncedAt), "PPp")
                    : "Never"
                }
              />
            </ListItem>
            {status?.mockMode && (
              <ListItem>
                <ListItemText primary="Mode" secondary="Demo / mock health data" />
              </ListItem>
            )}
          </List>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
            <SyncButton />
            {sessionUser ? (
              <Button variant="outlined" color="inherit" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <Button component={Link} href="/connect" variant="contained">
                Connect Google
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: "24px", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
            Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Google Health API scopes (placeholder until API credentials are configured):
          </Typography>
          <List dense>
            {(status?.scopes?.length ? status.scopes : ["fitness.activity.read", "fitness.sleep.read"]).map(
              (scope) => (
                <ListItem key={scope}>
                  <ListItemText primary={scope} />
                </ListItem>
              )
            )}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: "24px", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom color="error">
            Privacy & data
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
            <Button component={Link} href="/api/reports/csv?range=30" variant="outlined">
              Export all data (CSV)
            </Button>
            <Button color="error" variant="outlined" onClick={deleteData}>
              Delete account data
            </Button>
            <Button component={Link} href="/privacy" size="small">
              Privacy policy
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
