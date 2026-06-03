import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardOutlinedIcon },
  { label: "Sleep", href: "/sleep", icon: BedtimeOutlinedIcon },
  { label: "Heart", href: "/heart", icon: FavoriteBorderOutlinedIcon },
  { label: "Activity", href: "/activity", icon: DirectionsRunOutlinedIcon },
  { label: "Exercise", href: "/exercise", icon: FitnessCenterOutlinedIcon },
  { label: "Reports", href: "/reports", icon: AssessmentOutlinedIcon },
  { label: "Settings", href: "/settings", icon: SettingsOutlinedIcon },
] as const;
