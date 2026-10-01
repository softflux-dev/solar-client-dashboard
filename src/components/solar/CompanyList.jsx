import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Building2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

import CompanyRow from "@/components/solar/CompanyRow";
import EmptyState from "@/components/common/EmptyState";
import CompanyListSkeleton from "@/components/solar/CompanyListSkeleton";
import { Button } from "@/components/ui/button";
import { selectFilteredCompanies, setPage, fetchCompanies, buildFilterParams, clearFilters } from "@/store/slices/solarRequestsSlice";

export default function CompanyList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useSelector(buildFilterParams);
  const companies = useSelector(selectFilteredCompanies);
  const fetchStatus = useSelector((state) => state.solarRequests.fetchStatus);
  const fetchError = useSelector((state) => state.solarRequests.fetchError);
  const currentPage = useSelector((state) => state.solarRequests.currentPage);
  const totalPages = useSelector((state) => state.solarRequests.totalPages);
  const totalCompanies = useSelector((state) => state.solarRequests.totalCompanies);

  // Loading state
  if (fetchStatus === "loading" || fetchStatus === "idle") {
    return <CompanyListSkeleton />;
  }

  // Error state
  if (fetchStatus === "failed") {
    return (
      <EmptyState
        icon={AlertCircle}
        title={t("solar.fetchError")}
        description={fetchError ?? t("solar.fetchErrorHint")}
        actionLabel={t("common.retry")}
        onAction={() => dispatch(fetchCompanies(params))}
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
        actionLabel={t("solar.resetFilters")}
        onAction={() => dispatch(clearFilters())}
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
              aria-label={t("common.back")}
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
              aria-label={t("common.next")}
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
