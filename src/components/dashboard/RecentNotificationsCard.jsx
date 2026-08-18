import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Bell, CheckCircle2, Wallet } from "lucide-react";

import ListItemRow from "@/components/common/ListItemRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quotationDueSubtitle } from "@/lib/quotations";

const NOTIFICATION_ICONS = {
  check: CheckCircle2,
  wallet: Wallet,
};

export default function RecentNotificationsCard() {
  const { t, i18n } = useTranslation();
  const notifications = useSelector((state) => state.notifications.list);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dashboard.sections.recentNotifications")}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {notifications.map((notification) => (
          <ListItemRow
            key={notification.id}
            icon={NOTIFICATION_ICONS[notification.icon] || Bell}
            title={t(notification.titleKey)}
            subtitle={quotationDueSubtitle(t, i18n, notification.type, notification.dueDate)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
