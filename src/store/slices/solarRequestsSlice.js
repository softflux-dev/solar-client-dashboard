import { createSlice } from "@reduxjs/toolkit";

import companies from "@/data/companies.json";

const REGIONS = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad"];
const RATING_OPTIONS = ["9", "8", "7"];

const initialState = {
  companies,
  // filter state
  searchQuery: "",
  selectedRegion: "all", // "all" | region name
  selectedRating: "all", // "all" | "9" | "8" | "7"
  companyFilter: "all", // "all" | "favorites"
  // interaction state
  favoriteCompanyIds: companies.filter((c) => c.isFavorite).map((c) => c.id),
  expandedCompanyId: null,
  selectedCompanyId: null,
};

const solarRequestsSlice = createSlice({
  name: "solarRequests",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setRegion(state, action) {
      state.selectedRegion = action.payload;
    },
    setRating(state, action) {
      state.selectedRating = action.payload;
    },
    setCompanyFilter(state, action) {
      state.companyFilter = action.payload;
    },
    toggleFavorite(state, action) {
      const id = action.payload;
      state.favoriteCompanyIds = state.favoriteCompanyIds.includes(id)
        ? state.favoriteCompanyIds.filter((fid) => fid !== id)
        : [...state.favoriteCompanyIds, id];
    },
    setExpandedCompany(state, action) {
      state.expandedCompanyId = action.payload;
    },
    setSelectedCompany(state, action) {
      state.selectedCompanyId = action.payload;
    },
    clearSelectedCompany(state) {
      state.selectedCompanyId = null;
    },
    clearFilters(state) {
      state.searchQuery = "";
      state.selectedRegion = "all";
      state.selectedRating = "all";
      state.companyFilter = "all";
    },
  },
});

export const {
  setSearchQuery,
  setRegion,
  setRating,
  setCompanyFilter,
  toggleFavorite,
  setExpandedCompany,
  setSelectedCompany,
  clearSelectedCompany,
  clearFilters,
} = solarRequestsSlice.actions;

// Centralized filtering — all filter logic lives here so UI components
// never duplicate it. Search is case-insensitive over name/region/email.
export const selectFilteredCompanies = (state) => {
  const {
    companies,
    searchQuery,
    selectedRegion,
    selectedRating,
    companyFilter,
    favoriteCompanyIds,
  } = state.solarRequests;

  const query = searchQuery.trim().toLowerCase();

  return companies.filter((company) => {
    if (selectedRegion !== "all" && company.region !== selectedRegion) return false;
    if (selectedRating !== "all" && company.rating < Number(selectedRating)) return false;
    if (companyFilter === "favorites" && !favoriteCompanyIds.includes(company.id)) {
      return false;
    }
    if (query) {
      const haystack = `${company.name} ${company.region} ${company.email}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
};

export { REGIONS, RATING_OPTIONS };
export default solarRequestsSlice.reducer;
