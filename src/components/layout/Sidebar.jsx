import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { NAV_ITEMS } from "@/components/layout/nav-config";
import NavItem from "@/components/layout/NavItem";
import BrandLogo from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-30 hidden flex-col border-e border-sidebar-border bg-card text-sidebar-foreground transition-all duration-200 md:flex",
        sidebarOpen ? "w-72" : "w-[4.5rem]",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border",
          sidebarOpen ? "px-5" : "justify-center px-0",
        )}
      >
        <BrandLogo
          className={
            sidebarOpen ? "h-7 w-auto" : "h-7 w-10 object-contain object-left"
          }
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} collapsed={!sidebarOpen} />
        ))}
      </nav>

      {sidebarOpen && (
        <div className="border-t border-sidebar-border p-4">
          <p className="text-[11px] leading-relaxed text-foreground">
            {t("common.appName")}
          </p>
        </div>
      )}
    </aside>
  );
}
