import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import CompanyFilters from "@/components/solar/CompanyFilters";
import CompanyList from "@/components/solar/CompanyList";
import {
  fetchCompanies,
  buildFilterParams,
} from "@/store/slices/solarRequestsSlice";

export default function SolarRequests() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchStatus = useSelector((state) => state.solarRequests.fetchStatus);

  // Track filter state to detect changes
  const filterState = useSelector((state) => ({
    searchQuery: state.solarRequests.searchQuery,
    selectedRegion: state.solarRequests.selectedRegion,
    selectedRating: state.solarRequests.selectedRating,
    selectedMinProjects: state.solarRequests.selectedMinProjects,
    companyFilter: state.solarRequests.companyFilter,
    currentPage: state.solarRequests.currentPage,
    pageSize: state.solarRequests.pageSize,
  }));

  const filterRef = useRef(filterState);

  // Build params from current filter state
  const params = useSelector(buildFilterParams);

  // Fetch on mount
  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(fetchCompanies(params));
    }
  }, [dispatch, fetchStatus]);

  // Re-fetch when filters change (but not on initial mount)
  useEffect(() => {
    const prev = filterRef.current;
    const changed =
      prev.searchQuery !== filterState.searchQuery ||
      prev.selectedRegion !== filterState.selectedRegion ||
      prev.selectedRating !== filterState.selectedRating ||
      prev.selectedMinProjects !== filterState.selectedMinProjects ||
      prev.companyFilter !== filterState.companyFilter ||
      prev.currentPage !== filterState.currentPage ||
      prev.pageSize !== filterState.pageSize;

    if (changed && fetchStatus !== "idle") {
      dispatch(fetchCompanies(params));
    }
    filterRef.current = filterState;
  }, [filterState, dispatch, fetchStatus, params]);

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
