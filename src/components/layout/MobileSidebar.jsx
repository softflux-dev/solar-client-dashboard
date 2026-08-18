import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";

import { NAV_ITEMS } from "@/components/layout/nav-config";
import NavItem from "@/components/layout/NavItem";
import BrandLogo from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { setMobileSidebarOpen } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

export default function MobileSidebar() {
  const isOpen = useSelector((state) => state.ui.mobileSidebarOpen);
  const dispatch = useDispatch();

  return (
    <div className={cn("fixed inset-0 z-40 md:hidden", !isOpen && "pointer-events-none")}>
      {/* backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={() => dispatch(setMobileSidebarOpen(false))}
      />

      {/* panel */}
      <aside
        className={cn(
          "absolute inset-y-0 start-0 flex w-72 flex-col bg-card text-sidebar-foreground shadow-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <BrandLogo className="h-7 w-auto" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setMobileSidebarOpen(false))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} collapsed={false} />
          ))}
        </nav>
      </aside>
    </div>
  );
}
