"use client";

import { createTheme } from "@mui/material/styles";
import { PALETTE } from "@/lib/constants";

export const healthDeckTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: PALETTE.primary },
    secondary: { main: PALETTE.secondary },
    success: { main: PALETTE.success },
    warning: { main: PALETTE.warning },
    error: { main: PALETTE.error },
    background: {
      default: PALETTE.background,
      paper: PALETTE.surface,
    },
    text: {
      primary: PALETTE.textPrimary,
      secondary: PALETTE.textSecondary,
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: PALETTE.background,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
          border: "1px solid rgba(15, 23, 42, 0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "10px 22px",
        },
        contained: {
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});
