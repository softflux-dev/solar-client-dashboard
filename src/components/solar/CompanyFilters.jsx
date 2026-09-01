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
  REGIONS,
  RATING_OPTIONS,
  PROJECTS_OPTIONS,
  setSearchQuery,
  setRegion,
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
    <div className={cn("space-y-3 ", className)}>
      <div className="flex flex-col gap-3 lg:flex-row  lg:items-center w-full">
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

        {/* Region filter */}

        <Select
          value={selectedRegion}
          onValueChange={(v) => dispatch(setRegion(v))}
        >
          <SelectTrigger className="rounded-lg bg-white lg:w-40">
            <SelectValue placeholder={t("solar.allRegions")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("solar.allRegions")}</SelectItem>
            {REGIONS.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating filter */}

        <Select
          value={selectedRating}
          onValueChange={(v) => dispatch(setRating(v))}
        >
          <SelectTrigger className="rounded-lg bg-white lg:w-40">
            <SelectValue placeholder={t("solar.anyRating")} />
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

        {/* Company filter */}

        <Select
          value={companyFilter}
          onValueChange={(v) => dispatch(setCompanyFilter(v))}
        >
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
    </div>
  );
}
