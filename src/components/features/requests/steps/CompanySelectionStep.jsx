import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CompanyRow from "@/components/solar/CompanyRow";
import StepHeader from "@/components/features/requests/StepHeader";
import { toggleSelectedCompany } from "@/store/slices/requestsSlice";

export default function CompanySelectionStep() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const companies = useSelector((state) => state.solarRequests.companies);
  const selectedIds = useSelector((state) => state.requests.formData.selectedCompanyIds);

  return (
    <div>
      <StepHeader
        title={t("requestForm.steps.companies")}
        description={t("requestForm.steps.companiesHint")}
      />
      <div className="space-y-3">
        {companies.map((company) => (
          <CompanyRow
            key={company.id}
            company={company}
            selectable
            selected={selectedIds.includes(company.id)}
            onToggleSelect={(id) => dispatch(toggleSelectedCompany(id))}
          />
        ))}
      </div>
    </div>
  );
}
