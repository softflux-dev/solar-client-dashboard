import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Building2 } from "lucide-react";

import CompanyRow from "@/components/solar/CompanyRow";
import EmptyState from "@/components/common/EmptyState";
import { selectFilteredCompanies } from "@/store/slices/solarRequestsSlice";

export default function CompanyList() {
  const { t } = useTranslation();
  const companies = useSelector(selectFilteredCompanies);

  if (!companies.length) {
    return (
      <EmptyState
        icon={Building2}
        title={t("solar.noCompanies")}
        description={t("solar.noCompaniesHint")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {companies.map((company) => (
        <CompanyRow key={company.id} company={company} />
      ))}
    </div>
  );
}
