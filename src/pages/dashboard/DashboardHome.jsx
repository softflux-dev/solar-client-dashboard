import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import PendingApprovalsCard from "@/components/dashboard/PendingApprovalsCard";
import ActiveProjectsCard from "@/components/dashboard/ActiveProjectsCard";
import UpcomingInstallationsCard from "@/components/dashboard/UpcomingInstallationsCard";
import RecentNotificationsCard from "@/components/dashboard/RecentNotificationsCard";

export default function DashboardHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        actions={
          <Button onClick={() => navigate("/requests/new")}>
            <Plus className="h-4 w-4" />
            {t("dashboard.newSolarRequest")}
          </Button>
        }
      />

      <DashboardStatsGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PendingApprovalsCard />
        <ActiveProjectsCard />
        <UpcomingInstallationsCard />
        <RecentNotificationsCard />
      </div>
    </div>
  );
}
