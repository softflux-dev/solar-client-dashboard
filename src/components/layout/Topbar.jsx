import { useDispatch } from "react-redux";
import { Menu, PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChatMenu from "@/components/layout/ChatMenu";
import NotificationMenu from "@/components/layout/NotificationMenu";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import { toggleSidebar, setMobileSidebarOpen } from "@/store/slices/uiSlice";

export default function Topbar() {
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-card/95 px-4 backdrop-blur md:gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={() => dispatch(toggleSidebar())}
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => dispatch(setMobileSidebarOpen(true))}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="ms-auto flex items-center gap-1 md:gap-1.5">
        <ChatMenu />
        <NotificationMenu />
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
