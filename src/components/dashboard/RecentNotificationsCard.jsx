import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";

import quotationApprovedIcon from "@/assets/icons/quotationApproved.svg";
import paymentDueIcon from "@/assets/icons/paymentDue.svg";
import ListItemRow from "@/components/common/ListItemRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quotationDueSubtitle } from "@/lib/quotations";

const NOTIFICATION_ICONS = {
  check: quotationApprovedIcon,
  wallet: paymentDueIcon,
};

export default function RecentNotificationsCard() {
  const { t, i18n } = useTranslation();
  const notifications = useSelector((state) => state.notifications.list);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dashboard.sections.recentNotifications")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((notification) => (
          <ListItemRow
            key={notification.id}
            icon={NOTIFICATION_ICONS[notification.icon] || Bell}
            iconVariant="gradient"
            className="rounded-lg bg-muted/60 px-2"
            title={t(notification.titleKey)}
            subtitle={quotationDueSubtitle(t, i18n, notification.type, notification.dueDate)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
