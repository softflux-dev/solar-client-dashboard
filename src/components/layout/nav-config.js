import { createElement } from "react";
import dashbaordIcon from "@/assets/icons/sidebar/dashboard.svg";
import solarRequestIcon from "@/assets/icons/sidebar/solarRequest.svg";

// Central nav config so Sidebar + MobileSidebar never drift apart.
// `labelKey` maps to i18n keys in nav.*
// SVG imports are URL strings. NavItem renders <Icon className="..." /> like a
// lucide icon, so we expose them as components (no JSX to stay valid in a .js
// file) that render an <img> and forward className.
const makeIcon = (src) => (props) =>
  createElement("img", { src, alt: "", ...props });

const DashboardIcon = makeIcon(dashbaordIcon);
const SolarRequestIcon = makeIcon(solarRequestIcon);

export const NAV_ITEMS = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: DashboardIcon },
  { to: "/requests", labelKey: "nav.requests", icon: SolarRequestIcon },
];
