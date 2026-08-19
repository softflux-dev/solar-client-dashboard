import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import upcomingInstallationIcon from "@/assets/icons/upcomingInstallationIcon.svg";
import ListItemRow from "@/components/common/ListItemRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLongDate, formatTime } from "@/lib/date";

export default function UpcomingInstallationsCard() {
  const { t, i18n } = useTranslation();
  const installations = useSelector((state) => state.projects.upcomingInstallations);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dashboard.sections.upcomingInstallations")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {installations.map((item) => (
          <ListItemRow
            key={item.id}
            icon={upcomingInstallationIcon}
            iconVariant="gradient"
            className="rounded-lg bg-muted/60 px-2"
            title={t(item.titleKey)}
            subtitle={t("dashboard.upcoming.arrival", {
              company: item.companyName,
              date: formatLongDate(item.date, i18n.language),
              time: formatTime(item.time, i18n.language),
            })}
          />
        ))}
      </CardContent>
    </Card>
  );
}
