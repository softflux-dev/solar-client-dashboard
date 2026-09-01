import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RotateCcw, ChevronLeft, ChevronRight, Search } from "lucide-react";

import CompanyRow from "@/components/solar/CompanyRow";
import Spinner from "@/components/common/Spinner";
import StepHeader from "@/components/features/requests/StepHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toggleSelectedCompany } from "@/store/slices/requestsSlice";
import {
  REGIONS,
  RATING_OPTIONS,
  PROJECTS_OPTIONS,
  fetchCompanies,
  selectFilteredCompanies,
  setSearchQuery,
  setRegion,
  setRating,
  setMinProjects,
  setCompanyFilter,
  clearFilters,
} from "@/store/slices/solarRequestsSlice";

const STEP_PAGE_SIZE = 5;

export default function CompanySelectionStep() {
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

  if (fetchStatus === "loading" || (fetchStatus === "idle" && filteredCompanies.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Spinner className="h-6 w-6" />
        <p className="mt-3 text-sm">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div>
      <StepHeader
        title={t("requestForm.steps.companies")}
        description={t("requestForm.steps.companiesHint")}
      />

      {/* Filters — same as CompanyFilters */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder={t("common.search")}
            className="rounded-lg bg-white ps-9"
          />
        </div>

        {/* Region */}
        <Select value={selectedRegion} onValueChange={(v) => dispatch(setRegion(v))}>
          <SelectTrigger className="rounded-lg bg-white lg:w-40">
            <SelectValue placeholder={t("solar.allRegions")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("solar.allRegions")}</SelectItem>
            {REGIONS.map((region) => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating */}
        <Select value={selectedRating} onValueChange={(v) => dispatch(setRating(v))}>
          <SelectTrigger className="rounded-lg bg-white lg:w-40">
            <SelectValue placeholder={t("solar.anyRating")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("solar.anyRating")}</SelectItem>
            {RATING_OPTIONS.map((rating) => (
              <SelectItem key={rating} value={rating}>{rating}+</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Completed Projects */}
        <Select value={selectedMinProjects} onValueChange={(v) => dispatch(setMinProjects(v))}>
          <SelectTrigger className="rounded-lg bg-white lg:w-40">
            <SelectValue placeholder={t("solar.allProjects")} />
          </SelectTrigger>
          <SelectContent>
            {PROJECTS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.value === "all" ? t("solar.allProjects") : `${opt.label} ${t("solar.projects")}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Favourites */}
        <Select value={companyFilter} onValueChange={(v) => dispatch(setCompanyFilter(v))}>
          <SelectTrigger className="rounded-lg bg-white lg:w-40">
            <SelectValue placeholder={t("solar.allCompanies")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("solar.allCompanies")}</SelectItem>
            <SelectItem value="favorites">{t("solar.favorites")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground",
            !hasActiveFilters && "pointer-events-none opacity-0",
          )}
          onClick={() => dispatch(clearFilters())}
        >
          <RotateCcw className="h-4 w-4" />
          {t("solar.resetFilters")}
        </Button>
      </div>

      {/* Company list */}
      <div className="space-y-3">
        {paginatedCompanies.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("solar.noCompanies")}
          </p>
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
