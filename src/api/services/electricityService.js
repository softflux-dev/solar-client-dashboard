import Api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

// Keep the API's names as values: the provider lookup expects a city name.
export function normalizeOptions(payload, key) {
  const data = payload?.data ?? payload;
  const entries = data?.[key] ?? (key === "providers" ? data?.provider : undefined) ?? data;
  if (entries == null) return [];
  const list = Array.isArray(entries) ? entries : [entries];
  const names = list.map((item) => typeof item === "string" ? item :
    (key === "providers" ? item?.code : undefined) ?? item?.name ??
    item?.[key === "cities" ? "city" : key === "provinces" ? "province" : "provider"]);
  if (names.some((name) => typeof name !== "string")) {
    throw new Error(`Unexpected ${key} response format.`);
  }
  return [...new Set(names.map((name) => name.trim()).filter(Boolean))];
}

export async function getCities() {
  const { data } = await Api.get(ENDPOINTS.electricity.cities);
  return normalizeOptions(data, "cities");
}

export async function getProvinces() {
  const { data } = await Api.get(ENDPOINTS.electricity.provinces);
  return normalizeOptions(data, "provinces");
}

export async function getProviderByCity(city) {
  const { data } = await Api.get(ENDPOINTS.electricity.provider, { params: { city } });
  return normalizeOptions(data, "providers");
}
