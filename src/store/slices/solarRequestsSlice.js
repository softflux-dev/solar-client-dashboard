import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

import { getCompanies } from "@/api/services/solarRequestService";

const RATING_OPTIONS = ["9", "8", "7"];
const PROJECTS_OPTIONS = [
  { label: "Any", value: "all" },
  { label: "50+", value: "50" },
  { label: "100+", value: "100" },
  { label: "200+", value: "200" },
  { label: "500+", value: "500" },
];

/**
 * Clean a URL string returned by the backend.
 * The API sometimes returns malformed URLs (e.g. "https: //..." with a space).
 * This strips stray spaces and ensures the URL starts with http:// or https://.
 */
function cleanUrl(url) {
  if (typeof url !== "string") return null;
  const trimmed = url.replace(/\s+/g, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
}

/**
 * Map a raw API company object to the shape the UI components expect.
 */
function normalizeCompany(c) {
  const images = (c.images ?? [])
    .map(cleanUrl)
    .filter(Boolean);

  return {
    id: c._id,
    name: c.name ?? "",
    address: c.address ?? "Unknown",
    rating: c.rating ?? 0,
    phone: c.phone ?? "",
    email: c.email ?? "",
    description: c.description ?? "",
    logo: images[0] ?? null,
    images,
    projects: c.completedProjects ?? 0,
    isFavourite: c.isFavourite ?? false,
    region: c.region ?? "Unknown",
  };
}

// ─── Async thunk: fetch companies from the backend ────────────────────────────
export const fetchCompanies = createAsyncThunk(
  "solarRequests/fetchCompanies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await getCompanies(params);
      return {
        companies: result.companies.map(normalizeCompany),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ?? "Failed to load companies.";
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  companies: [],
  // fetch status
  fetchStatus: "idle", // idle | loading | succeeded | failed
  fetchError: null,
  // pagination
  currentPage: 1,
  totalPages: 1,
  totalCompanies: 0,
  pageSize: 10,
  // filter state (client-side for CompanySelectionStep, server-side for main list)
  searchQuery: "",
  selectedRegion: "all", // "all" | region name
  selectedRating: "all", // "all" | "9" | "8" | "7"
  selectedMinProjects: "all", // "all" | "50" | "100" | "200" | "500"
  companyFilter: "all", // "all" | "favorites"
  // interaction state
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
    setMinProjects(state, action) {
      state.selectedMinProjects = action.payload;
    },
    setCompanyFilter(state, action) {
      state.companyFilter = action.payload;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
      state.currentPage = 1;
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
      state.selectedMinProjects = "all";
      state.companyFilter = "all";
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.companies = action.payload.companies;
        state.totalCompanies = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setRegion,
  setRating,
  setMinProjects,
  setCompanyFilter,
  setPage,
  setPageSize,
  setExpandedCompany,
  setSelectedCompany,
  clearSelectedCompany,
  clearFilters,
} = solarRequestsSlice.actions;

// ─── Client-side filtering selector (for CompanySelectionStep) ────────────────
// Memoized — returns a stable reference when inputs haven't changed.
export const selectFilteredCompanies = createSelector(
  [
    (state) => state.solarRequests.companies,
    (state) => state.solarRequests.searchQuery,
    (state) => state.solarRequests.selectedRegion,
    (state) => state.solarRequests.selectedRating,
    (state) => state.solarRequests.selectedMinProjects,
    (state) => state.solarRequests.companyFilter,
  ],
  (companies, searchQuery, selectedRegion, selectedRating, selectedMinProjects, companyFilter) => {
    const query = searchQuery.trim().toLowerCase();

    return companies.filter((company) => {
      if (selectedRegion !== "all" && company.region !== selectedRegion) return false;
      if (selectedRating !== "all" && company.rating < Number(selectedRating)) return false;
      if (selectedMinProjects !== "all" && company.projects < Number(selectedMinProjects)) return false;
      if (companyFilter === "favorites" && !company.isFavourite) return false;
      if (query) {
        const haystack = `${company.name} ${company.region} ${company.email}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  },
);

// ─── Server-side filter params builder (for API calls) ───────────────────────
// Builds query params from filter state for the server-side endpoint.
export const buildFilterParams = createSelector(
  [
    (state) => state.solarRequests.searchQuery,
    (state) => state.solarRequests.selectedRegion,
    (state) => state.solarRequests.selectedRating,
    (state) => state.solarRequests.selectedMinProjects,
    (state) => state.solarRequests.companyFilter,
    (state) => state.solarRequests.currentPage,
    (state) => state.solarRequests.pageSize,
  ],
  (searchQuery, selectedRegion, selectedRating, selectedMinProjects, companyFilter, currentPage, pageSize) => {
    const params = { page: currentPage, limit: pageSize };
    if (searchQuery.trim()) params.name = searchQuery.trim();
    if (selectedRegion !== "all") params.region = selectedRegion;
    if (selectedRating !== "all") params.minRating = Number(selectedRating);
    if (selectedMinProjects !== "all") params.minCompletedProjects = Number(selectedMinProjects);
    if (companyFilter === "favorites") params.isFavourite = true;
    return params;
  },
);

export { RATING_OPTIONS, PROJECTS_OPTIONS };
export default solarRequestsSlice.reducer;
