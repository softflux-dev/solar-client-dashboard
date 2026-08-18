import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { quotationDueSubtitle } from "@/lib/quotations";

export default function NotificationMenu() {
  const { t, i18n } = useTranslation();
  const notifications = useSelector((state) => state.notifications.list);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-brand-gradient ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("topbar.notifications")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((n) => (
          <DropdownMenuItem key={n.id} className="cursor-default focus:bg-transparent">
            <div className="flex w-full items-start gap-2.5 py-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{t(n.titleKey)}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {quotationDueSubtitle(t, i18n, n.type, n.dueDate)}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
