"use client";

import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  color?: string;
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  subtext,
  icon,
  color = "#2563EB",
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card sx={{ borderRadius: "24px", height: "100%" }}>
        <CardContent>
          <Skeleton width="60%" />
          <Skeleton width="40%" height={48} sx={{ my: 1 }} />
          <Skeleton width="50%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          borderRadius: "24px",
          height: "100%",
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(15, 23, 42, 0.1)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {icon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "14px",
                  bgcolor: `${color}14`,
                  color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
            {value}
          </Typography>
          {subtext && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {subtext}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
