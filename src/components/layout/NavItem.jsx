import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function NavItem({ to, labelKey, icon: Icon, collapsed }) {
  const { t } = useTranslation();

  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium leading-snug transition-colors",
            "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            isActive &&
              "bg-brand-gradient text-white shadow-sm hover:text-white"
          )}
        >
          <Icon
            className={cn("h-5 w-5 shrink-0", isActive && "brightness-0 invert")}
          />
          {!collapsed && (
            <span className="min-w-0 flex-1 break-words">{t(labelKey)}</span>
          )}
        </div>
      )}
    </NavLink>
  );
}
