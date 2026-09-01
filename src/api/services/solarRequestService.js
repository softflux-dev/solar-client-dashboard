import Api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Fetch solar companies from the backend with optional filters and pagination.
 * @param {object} params - Query parameters.
 * @param {string}   params.name                 - Search by company name.
 * @param {string}   params.region               - Filter by region.
 * @param {boolean}  params.isFavourite           - Filter favourites only.
 * @param {number}   params.minRating             - Minimum rating.
 * @param {number}   params.minCompletedProjects  - Minimum completed projects.
 * @param {number}   params.page                  - Page number (1-based).
 * @param {number}   params.limit                 - Items per page.
 * @returns {{ companies: Array, total: number, page: number, limit: number, totalPages: number }}
 */
export async function getCompanies(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  const url = qs
    ? `${ENDPOINTS.solarRequest.getCompanies}?${qs}`
    : ENDPOINTS.solarRequest.getCompanies;
  const response = await Api.get(url);
  const data = response.data.data;
  // Normalize: if the API returns just an array, wrap it
  if (Array.isArray(data)) {
    return { companies: data, total: data.length, page: 1, limit: data.length, totalPages: 1 };
  }
  return {
    companies: data.companies ?? data.data ?? data,
    total: data.total ?? data.companies?.length ?? 0,
    page: data.page ?? 1,
    limit: data.limit ?? 10,
    totalPages: data.totalPages ?? 1,
  };
}

/**
 * Create a new customer lead (solar request).
 * @param {object} payload - The lead data matching the API schema.
 * Returns: the created lead object from the backend.
 */
export async function createLead(payload) {
  const response = await Api.post(ENDPOINTS.solarRequest.create, payload);
  return response.data.data;
}
