import { useTranslation } from "react-i18next";
import chatIcon from "@/assets/icons/topbar/chatIcon.svg";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MESSAGES = [
  { id: 1, from: "Sunrise Solar Co.", preview: "Your quotation is ready to review…", time: "5m" },
  { id: 2, from: "Solar Support", preview: "We've answered your question.", time: "1h" },
];

export default function ChatMenu() {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <img src={chatIcon} className="h-4 w-4" />
          <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-brand-gradient ring-2 ring-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("topbar.messages")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MESSAGES.map((m) => (
          <DropdownMenuItem key={m.id} className="cursor-default focus:bg-transparent">
            <div className="flex w-full items-center justify-between gap-3 py-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{m.from}</span>
                <span className="truncate text-xs text-muted-foreground">{m.preview}</span>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
