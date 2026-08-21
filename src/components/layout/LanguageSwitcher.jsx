import { useTranslation } from "react-i18next";
import { Check, Languages } from "lucide-react";
import { GB, PK } from "country-flag-icons/react/3x2";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN", Flag: GB },
  { code: "ur", label: "اردو", short: "UR", Flag: PK },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const active = LANGUAGES.find((l) => l.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-border/60 px-3 transition-colors hover:bg-brand-gradient-soft hover:text-foreground"
        >
          <active.Flag className="h-4 w-5 rounded-sm" />
          <span className="text-xs font-semibold uppercase">
            {active?.short}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem] p-1">
        {LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={cn(
                "gap-2.5 rounded-md px-2.5 py-2 text-sm",
                isActive && "bg-brand-gradient-soft font-medium",
              )}
            >
              <lang.Flag className="h-4 w-5 rounded-sm" />
              <span className="flex-1">{lang.label}</span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
