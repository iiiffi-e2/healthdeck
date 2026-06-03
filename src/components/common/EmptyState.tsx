"use client";

import { Box, Typography, Button } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 2 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
