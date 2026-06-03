"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

interface InsightCardProps {
  message: string;
}

export function InsightCard({ message }: InsightCardProps) {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        bgcolor: "primary.main",
        color: "white",
        background: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
      }}
    >
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: "14px",
            p: 1,
            display: "flex",
          }}
        >
          <LightbulbOutlinedIcon />
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}
