"use client";

import { Box, Container } from "@mui/material";
import { Sidebar, DRAWER_WIDTH } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { HealthDisclaimer } from "@/components/common/HealthDisclaimer";

interface AppShellProps {
  children: React.ReactNode;
  maxWidth?: "lg" | "xl" | false;
  showDisclaimer?: boolean;
}

export function AppShell({
  children,
  maxWidth = "xl",
  showDisclaimer = true,
}: AppShellProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pb: { xs: 10, md: 4 },
        }}
      >
        <Container maxWidth={maxWidth} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
          {children}
          {showDisclaimer && (
            <Box sx={{ mt: 4 }}>
              <HealthDisclaimer compact />
            </Box>
          )}
        </Container>
      </Box>
      <BottomNav />
    </Box>
  );
}
