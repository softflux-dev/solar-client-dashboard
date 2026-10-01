import RegionFilter from "@/components/solar/RegionFilter";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RotateCcw, Search } from "lucide-react";

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
import {
  RATING_OPTIONS,
  PROJECTS_OPTIONS,
  setSearchQuery,
  setRating,
  setMinProjects,
  setCompanyFilter,
  clearFilters,
} from "@/store/slices/solarRequestsSlice";

export default function CompanyFilters({ className }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const searchQuery = useSelector((state) => state.solarRequests.searchQuery);
  const selectedRegion = useSelector(
    (state) => state.solarRequests.selectedRegion,
  );
  const selectedRating = useSelector(
    (state) => state.solarRequests.selectedRating,
  );
  const selectedMinProjects = useSelector(
    (state) => state.solarRequests.selectedMinProjects,
  );
  const companyFilter = useSelector(
    (state) => state.solarRequests.companyFilter,
  );

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedRegion !== "all" ||
    selectedRating !== "all" ||
    selectedMinProjects !== "all" ||
    companyFilter !== "all";

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative min-w-0 sm:col-span-2 xl:col-span-4">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            aria-label={t("common.search")}
            placeholder={t("common.search")}
            className="ps-9"
          />
        </div>

        <RegionFilter />

        {/* Rating filter */}

        <Select
          value={selectedRating}
          onValueChange={(v) => dispatch(setRating(v))}
        >
          <SelectTrigger aria-label={t("solar.anyRating")}><SelectValue placeholder={t("solar.anyRating")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("solar.anyRating")}</SelectItem>
            {RATING_OPTIONS.map((rating) => (
              <SelectItem key={rating} value={rating}>
                {rating}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Completed projects filter */}

        <Select
          value={selectedMinProjects}
          onValueChange={(v) => dispatch(setMinProjects(v))}
        >
          <SelectTrigger aria-label={t("solar.allProjects")}><SelectValue placeholder={t("solar.allProjects")} />
          </SelectTrigger>
          <SelectContent>
            {PROJECTS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.value === "all" ? t("solar.allProjects") : `${opt.label} ${t("solar.projects")}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Company filter */}

        <Select
          value={companyFilter}
          onValueChange={(v) => dispatch(setCompanyFilter(v))}
        >
          <SelectTrigger aria-label={t("solar.allCompanies")}><SelectValue placeholder={t("solar.allCompanies")} />
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
            !hasActiveFilters && "hidden",
          )}
          onClick={() => dispatch(clearFilters())}
        >
          <RotateCcw className="h-4 w-4" />
          {t("solar.resetFilters")}
        </Button>
      </div>
    </div>
  );
}
