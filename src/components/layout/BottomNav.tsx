"use client";

import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navItems";

const MOBILE_NAV = NAV_ITEMS.filter((item) =>
  ["/dashboard", "/sleep", "/heart", "/activity", "/settings"].includes(item.href)
);

export function BottomNav() {
  const pathname = usePathname();
  const value = MOBILE_NAV.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <Paper
      elevation={8}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderRadius: "24px 24px 0 0",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation value={value >= 0 ? value : 0} showLabels>
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <BottomNavigationAction
              key={item.href}
              label={item.label}
              icon={<Icon />}
              component={Link}
              href={item.href}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
