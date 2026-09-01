import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Building2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

import CompanyRow from "@/components/solar/CompanyRow";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { selectFilteredCompanies, setPage } from "@/store/slices/solarRequestsSlice";

export default function CompanyList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const companies = useSelector(selectFilteredCompanies);
  const fetchStatus = useSelector((state) => state.solarRequests.fetchStatus);
  const fetchError = useSelector((state) => state.solarRequests.fetchError);
  const currentPage = useSelector((state) => state.solarRequests.currentPage);
  const totalPages = useSelector((state) => state.solarRequests.totalPages);
  const totalCompanies = useSelector((state) => state.solarRequests.totalCompanies);

  // Loading state
  if (fetchStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Spinner className="h-6 w-6" />
        <p className="mt-3 text-sm">{t("common.loading")}</p>
      </div>
    );
  }

  // Error state
  if (fetchStatus === "failed") {
    return (
      <EmptyState
        icon={AlertCircle}
        title={t("solar.fetchError")}
        description={fetchError ?? t("solar.fetchErrorHint")}
      />
    );
  }

  // Empty after filters
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
    <div>
      <div className="space-y-3">
        {companies.map((company) => (
          <CompanyRow key={company.id} company={company} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {totalCompanies} {t("solar.companiesFound")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage <= 1}
              onClick={() => dispatch(setPage(currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => dispatch(setPage(currentPage + 1))}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
