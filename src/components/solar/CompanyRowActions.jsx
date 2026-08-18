import { useTranslation } from "react-i18next";
import { Heart, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function CompanyRowActions({
  company,
  selectable = false,
  selected = false,
  isFavorite = false,
  onToggleSelect,
  onToggleFavorite,
  onExpand,
  onGetQuotations,
}) {
  const { t } = useTranslation();

  if (selectable) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect?.(company.id)}
          aria-label={t("solar.selectCompany", { name: company.name })}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("solar.favorite")}
        className={cn(isFavorite && "text-destructive")}
        onClick={() => onToggleFavorite(company.id)}
      >
        <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
      </Button>
      <Button variant="outline" size="sm" onClick={onExpand}>
        {t("solar.viewDetail")}
      </Button>
      <Button size="sm" onClick={onGetQuotations}>
        {t("solar.getQuotations")}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled
        title={t("solar.chatSoon")}
        aria-label={t("solar.chat")}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
