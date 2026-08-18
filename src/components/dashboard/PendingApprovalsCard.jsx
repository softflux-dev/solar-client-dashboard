import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Clock } from "lucide-react";

import ListItemRow from "@/components/common/ListItemRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quotationDueSubtitle } from "@/lib/quotations";

export default function PendingApprovalsCard() {
  const { t, i18n } = useTranslation();
  const pending = useSelector((state) =>
    state.quotations.list.filter((q) => q.status !== "approved")
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dashboard.sections.pendingApprovals")}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {pending.map((quotation, index) => (
          <ListItemRow
            key={quotation.id}
            icon={Clock}
            title={quotation.title}
            subtitle={quotationDueSubtitle(t, i18n, quotation.type, quotation.dueDate)}
            action={
              <Button variant={index === 0 ? "default" : "outline"} size="sm">
                {t("dashboard.actions.viewQuotations")}
              </Button>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
