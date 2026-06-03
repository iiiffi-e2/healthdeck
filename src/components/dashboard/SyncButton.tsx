"use client";

import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

interface SyncButtonProps {
  onSynced?: () => void;
}

export function SyncButton({ onSynced }: SyncButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health/sync", { method: "POST" });
      if (res.ok) onSynced?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={loading ? <CircularProgress size={18} /> : <SyncIcon />}
      onClick={handleSync}
      disabled={loading}
      sx={{ borderRadius: "14px" }}
    >
      {loading ? "Syncing…" : "Sync now"}
    </Button>
  );
}
