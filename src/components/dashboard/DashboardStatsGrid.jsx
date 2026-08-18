import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Award,
  CheckCircle2,
  Clock,
  Gauge,
  Wallet,
  Wrench,
} from "lucide-react";

import StatCard from "@/components/common/StatCard";
import {
  selectQuotationStats,
  selectInstallationProgressCount,
} from "@/store/selectors/dashboardSelectors";

export default function DashboardStatsGrid() {
  const { t } = useTranslation();
  const { total, approved, awaitingDecision } =
    useSelector(selectQuotationStats);
  const installationProgress = useSelector(selectInstallationProgressCount);

  const stats = [
    { label: t("dashboard.stats.totalQuotations"), value: total, icon: Award },
    {
      label: t("dashboard.stats.approvedQuotations"),
      value: approved,
      icon: CheckCircle2,
      highlighted: false,
    },
    {
      label: t("dashboard.stats.awaitingDecision"),
      value: awaitingDecision,
      icon: Clock,
    },
    {
      label: t("dashboard.stats.installationProgress"),
      value: installationProgress,
      icon: Wrench,
    },
    // Green Meter Status and Payment Summary have no backing feature yet;
    // these static placeholders should become real selectors later.
    {
      label: t("dashboard.stats.greenMeterStatus"),
      // value: t("dashboard.placeholders.greenMeter"),
      value: 2,
      icon: Gauge,
    },
    {
      label: t("dashboard.stats.paymentSummary"),
      // value: t("dashboard.placeholders.paymentSummary"),
      value: 3,
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
