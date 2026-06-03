"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DATE_RANGE_OPTIONS, type DateRangeDays } from "@/lib/constants";

interface DateRangeSelectorProps {
  value: DateRangeDays;
  onChange: (value: DateRangeDays) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, v) => v && onChange(v as DateRangeDays)}
      size="small"
      sx={{
        bgcolor: "background.paper",
        borderRadius: "14px",
        p: 0.5,
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "12px !important",
          px: 2,
          py: 0.75,
          mx: 0.25,
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          },
        },
      }}
    >
      {DATE_RANGE_OPTIONS.map((days) => (
        <ToggleButton key={days} value={days}>
          {days}d
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
