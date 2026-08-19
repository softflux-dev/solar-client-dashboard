import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import pendingApprovalIcon from "@/assets/icons/pendingApprovalIcon.svg";
import ListItemRow from "@/components/common/ListItemRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quotationDueSubtitle } from "@/lib/quotations";

export default function PendingApprovalsCard() {
  const { t, i18n } = useTranslation();
  const pending = useSelector((state) =>
    state.quotations.list.filter((q) => q.status !== "approved"),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("dashboard.sections.pendingApprovals")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {pending.map((quotation) => (
          <ListItemRow
            key={quotation.id}
            icon={pendingApprovalIcon}
            iconVariant="gradient"
            className="rounded-lg bg-muted/60 px-2"
            title={quotation.title}
            subtitle={quotationDueSubtitle(
              t,
              i18n,
              quotation.type,
              quotation.dueDate,
            )}
            action={
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-brand-gradient hover:text-white"
              >
                {t("dashboard.actions.viewQuotations")}
              </Button>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
