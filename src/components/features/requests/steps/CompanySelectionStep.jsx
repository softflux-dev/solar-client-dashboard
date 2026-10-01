import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, AlertCircle, Building2 } from "lucide-react";
import CompanyFilters from "@/components/solar/CompanyFilters";
import CompanyListSkeleton from "@/components/solar/CompanyListSkeleton";
import CompanyRow from "@/components/solar/CompanyRow";
import EmptyState from "@/components/common/EmptyState";
import StepHeader from "@/components/features/requests/StepHeader";
import ValidationErrors from "@/components/common/ValidationErrors";
import { Button } from "@/components/ui/button";
import { toggleSelectedCompany } from "@/store/slices/requestsSlice";
import { fetchCompanies, selectFilteredCompanies, clearFilters } from "@/store/slices/solarRequestsSlice";

const STEP_PAGE_SIZE = 5;

export default function CompanySelectionStep({ errors = {} }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filteredCompanies = useSelector(selectFilteredCompanies);
  const fetchStatus = useSelector((state) => state.solarRequests.fetchStatus);
  const searchQuery = useSelector((state) => state.solarRequests.searchQuery);
  const selectedRegion = useSelector((state) => state.solarRequests.selectedRegion);
  const selectedRating = useSelector((state) => state.solarRequests.selectedRating);
  const selectedMinProjects = useSelector((state) => state.solarRequests.selectedMinProjects);
  const companyFilter = useSelector((state) => state.solarRequests.companyFilter);
  const selectedIds = useSelector((state) => state.requests.formData.selectedCompanyIds);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / STEP_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedCompanies = filteredCompanies.slice(
    (safePage - 1) * STEP_PAGE_SIZE,
    safePage * STEP_PAGE_SIZE,
  );

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedRegion, selectedRating, selectedMinProjects, companyFilter]);

  // If companies haven't been loaded yet (e.g. direct navigation), fetch them
  useEffect(() => {
    if (fetchStatus === "idle" && filteredCompanies.length === 0) {
      dispatch(fetchCompanies());
    }
  }, [dispatch, fetchStatus, filteredCompanies.length]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedRegion !== "all" ||
    selectedRating !== "all" ||
    selectedMinProjects !== "all" ||
    companyFilter !== "all";

  return (
    <div>
      <StepHeader
        title={t("requestForm.steps.companies")}
        description={t("requestForm.steps.companiesHint")}
      />

      <ValidationErrors errors={errors} className="mb-4" />

      <CompanyFilters className="mb-5" />
      {/* Company list */}
      <div className="space-y-3">
        {fetchStatus === "loading" || fetchStatus === "idle" ? <CompanyListSkeleton /> : fetchStatus === "failed" ? (
          <EmptyState icon={AlertCircle} title={t("solar.fetchError")} description={t("solar.fetchErrorHint")} actionLabel={t("common.retry")} onAction={() => dispatch(fetchCompanies())} />
        ) : paginatedCompanies.length === 0 ? (
<EmptyState icon={Building2} title={t("solar.noCompanies")} description={t("solar.noCompaniesHint")} actionLabel={hasActiveFilters ? t("solar.resetFilters") : undefined} onAction={() => dispatch(clearFilters())} />
        ) : (
          paginatedCompanies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              selectable
              selected={selectedIds.includes(company.id)}
              onToggleSelect={(id) => dispatch(toggleSelectedCompany(id))}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredCompanies.length > STEP_PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredCompanies.length} {t("solar.companiesFound")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label={t("common.back")}
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {safePage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label={t("common.next")}
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
