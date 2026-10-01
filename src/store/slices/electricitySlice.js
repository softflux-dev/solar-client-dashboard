import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCities, getProvinces, getProviderByCity } from "@/api/services/electricityService";

const makeFetch = (key, service) => createAsyncThunk(
  `electricity/fetch${key}`,
  async (arg, { rejectWithValue }) => {
    try {
      return await service(arg);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? error.message ?? `Failed to load ${key}.`);
    }
  },
  { condition: (arg, { getState }) => {
    const entry = key === "providers"
      ? getState().electricity.providersByCity[arg]
      : getState().electricity[key];
    return entry?.status !== "loading" && entry?.status !== "succeeded";
  } },
);

export const fetchCities = makeFetch("cities", getCities);
export const fetchProvinces = makeFetch("provinces", getProvinces);
export const fetchProviders = makeFetch("providers", getProviderByCity);

const emptyEntry = () => ({ items: [], status: "idle", error: null });
export const EMPTY_LOOKUP = emptyEntry();

const electricitySlice = createSlice({
  name: "electricity",
  initialState: { cities: emptyEntry(), provinces: emptyEntry(), providersByCity: {} },
  reducers: {},
  extraReducers: (builder) => {
    for (const [key, thunk] of [["cities", fetchCities], ["provinces", fetchProvinces], ["providers", fetchProviders]]) {
      const entryFor = (state, action) => key === "providers"
        ? (state.providersByCity[action.meta.arg] ??= emptyEntry())
        : state[key];
      builder.addCase(thunk.pending, (state, action) => {
        Object.assign(entryFor(state, action), { status: "loading", error: null });
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        Object.assign(entryFor(state, action), { status: "succeeded", items: action.payload });
      });
      builder.addCase(thunk.rejected, (state, action) => {
        Object.assign(entryFor(state, action), { status: "failed", error: action.payload ?? action.error.message });
      });
    }
  },
});

export default electricitySlice.reducer;
