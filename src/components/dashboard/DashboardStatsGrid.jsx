import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import StatCard from "@/components/common/StatCard";
import approvedQuotationsIcon from "@/assets/icons/dashboardIcons/approvedQuotations.svg";
import awaitingDecisionIcon from "@/assets/icons/dashboardIcons/Vector-1.svg";
import greenMeterStatusIcon from "@/assets/icons/dashboardIcons/Black-1.svg";
import installationProgressIcon from "@/assets/icons/dashboardIcons/Black.svg";
import totalQuotationsIcon from "@/assets/icons/dashboardIcons/Vector.svg";
import paymentSummaryIcon from "@/assets/icons/dashboardIcons/Vector-2.svg";
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
    {
      label: t("dashboard.stats.totalQuotations"),
      value: total,
      icon: totalQuotationsIcon,
    },
    {
      label: t("dashboard.stats.approvedQuotations"),
      value: approved,
      icon: approvedQuotationsIcon,
    },
    {
      label: t("dashboard.stats.awaitingDecision"),
      value: awaitingDecision,
      icon: awaitingDecisionIcon,
    },
    {
      label: t("dashboard.stats.installationProgress"),
      value: installationProgress,
      icon: installationProgressIcon,
    },
    // Green Meter Status and Payment Summary have no backing feature yet;
    // these static placeholders should become real selectors later.
    {
      label: t("dashboard.stats.greenMeterStatus"),
      value: 2,
      icon: greenMeterStatusIcon,
    },
    {
      label: t("dashboard.stats.paymentSummary"),
      value: 3,
      icon: paymentSummaryIcon,
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
