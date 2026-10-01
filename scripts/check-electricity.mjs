import assert from "node:assert/strict";
import { createServer } from "vite";
import { configureStore } from "@reduxjs/toolkit";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
globalThis.sessionStorage = { getItem: () => null };
try {
  const { default: Api } = await server.ssrLoadModule("/src/api/axios.js");
  const service = await server.ssrLoadModule("/src/api/services/electricityService.js");
  const electricity = await server.ssrLoadModule("/src/store/slices/electricitySlice.js");
  const requests = await server.ssrLoadModule("/src/store/slices/requestsSlice.js");
  const { customerSchema } = await server.ssrLoadModule("/src/components/features/requests/validation.js");
  const store = configureStore({ reducer: { electricity: electricity.default, requests: requests.default } });

  assert.deepEqual(service.normalizeOptions({ data: { cities: ["Haripur", "Haripur"] } }, "cities"), ["Haripur"]);
  assert.deepEqual(service.normalizeOptions({ data: { provider: "PESCO" } }, "providers"), ["PESCO"]);
  assert.deepEqual(service.normalizeOptions({ data: { city: "Haripur", province: "Khyber Pakhtunkhwa", provider: { code: "HAZECO", name: "Hazara Electric Supply Company", type: "DISCO" } } }, "providers"), ["HAZECO"]);
  assert.deepEqual(service.normalizeOptions({ data: [{ city: "Haripur", province: "Khyber Pakhtunkhwa" }] }, "cities"), ["Haripur"]);
  assert.deepEqual(service.normalizeOptions({ provinces: [{ name: "Punjab" }] }, "provinces"), ["Punjab"]);
  assert.throws(() => service.normalizeOptions({ unexpected: true }, "cities"));

  const pending = {};
  Api.defaults.adapter = (config) => new Promise((resolve, reject) => {
    pending[config.params?.city ?? config.url] = {
      resolve: (data) => resolve({ data, status: 200, statusText: "OK", headers: {}, config }), reject,
    };
  });
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  const provinces = store.dispatch(electricity.fetchProvinces());
  const cities = store.dispatch(electricity.fetchCities());
  await flush();
  pending["electricity/provinces"].resolve({ data: ["Punjab"] });
  pending["electricity/cities"].resolve({ data: ["Haripur", "Lahore"] });
  await Promise.all([provinces, cities]);
  assert.deepEqual(store.getState().electricity.cities.items, ["Haripur", "Lahore"]);
  assert.deepEqual(store.getState().electricity.provinces.items, ["Punjab"]);

  const first = store.dispatch(electricity.fetchProviders("Haripur"));
  const second = store.dispatch(electricity.fetchProviders("Lahore"));
  await flush();
  pending.Lahore.resolve({ data: { provider: "LESCO" } });
  await second;
  pending.Haripur.resolve({ data: { provider: "PESCO" } });
  await first;
  assert.deepEqual(store.getState().electricity.providersByCity.Lahore.items, ["LESCO"]);
  assert.deepEqual(store.getState().electricity.providersByCity.Haripur.items, ["PESCO"]);

  store.dispatch(requests.updateFormData({ section: "customer", data: { city: "Haripur" } }));
  store.dispatch(requests.updateFormData({ section: "property", data: { disco: "PESCO" } }));
  store.dispatch(requests.updateFormData({ section: "customer", data: { firstName: "Ahmed" } }));
  assert.equal(store.getState().requests.formData.property.disco, "PESCO");
  store.dispatch(requests.updateFormData({ section: "customer", data: { city: "Lahore" } }));
  assert.equal(store.getState().requests.formData.property.disco, "");

  const failed = store.dispatch(electricity.fetchProviders("Unknown"));
  await flush();
  pending.Unknown.reject(new Error("Unavailable"));
  await failed;
  assert.equal(store.getState().electricity.providersByCity.Unknown.status, "failed");
  const retry = store.dispatch(electricity.fetchProviders("Unknown"));
  await flush();
  pending.Unknown.resolve({ data: [] });
  await retry;
  assert.equal(store.getState().electricity.providersByCity.Unknown.status, "succeeded");

  for (const phone of ["+92 300 1234567", "03001234567"]) assert(customerSchema.shape.phone.safeParse(phone).success);
  for (const phone of ["0300abc1234", "---", "12", "12+34567890"]) assert(!customerSchema.shape.phone.safeParse(phone).success);
  for (const cnic of ["", "42201-1234567-8", "4220112345678"]) assert(customerSchema.shape.cnic.safeParse(cnic).success);
  for (const cnic of ["42201-abcdefg-8", "123", "-------------"]) assert(!customerSchema.shape.cnic.safeParse(cnic).success);
  console.log("Electricity integration checks passed.");
} finally {
  await server.close();
  delete globalThis.sessionStorage;
}
