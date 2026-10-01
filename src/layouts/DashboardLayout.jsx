import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[padding] duration-150 motion-reduce:transition-none",
          sidebarOpen ? "md:ps-72" : "md:ps-[4.5rem]"
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
