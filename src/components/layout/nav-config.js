import { LayoutDashboard, FileText } from "lucide-react";

// Central nav config so Sidebar + MobileSidebar never drift apart.
// `labelKey` maps to i18n keys in nav.*
export const NAV_ITEMS = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/requests", labelKey: "nav.requests", icon: FileText },
];
