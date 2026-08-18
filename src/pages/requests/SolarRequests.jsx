import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import CompanyFilters from "@/components/solar/CompanyFilters";
import CompanyList from "@/components/solar/CompanyList";

export default function SolarRequests() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Top-level CTA: starts the FULL quotation flow including company selection.
  const handleGetQuotations = () => {
    navigate("/requests/new");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("solar.pageTitle")}
        subtitle={t("solar.pageSubtitle")}
        actions={
          <Button onClick={handleGetQuotations}>
            {t("solar.getQuotations")}
          </Button>
        }
      />

      <CompanyFilters />
      <CompanyList />
    </div>
  );
}
