import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createLead } from "@/api/services/solarRequestService";

// ─── Map form values to API-expected values ───────────────────────────────────

/** ownershipStatus: "own" → "Owned", "rental" → "Rental" */
const OWNERSHIP_MAP = { own: "Owned", rental: "Rental" };

/** city: "islamabad" → "Islamabad" */
function capitalizeCity(city) {
  if (!city) return "";
  return city.charAt(0).toUpperCase() + city.slice(1);
}

/**
 * Transform the raw Redux form data into the payload shape the
 * /lead/create-customer-leads endpoint expects.
 *
 * @param {object} formData   – state.requests.formData
 * @param {string} companyId  – the selected company _id
 * @param {Array}  docUrls    – Cloudinary URLs for uploaded documents
 * @returns {object}          – API-ready payload
 */
function buildLeadPayload(formData, companyId, docUrls) {
  const { customer, property, additional } = formData;

  return {
    companyId,
    customer: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email,
      cnic: customer.cnic,
      city: capitalizeCity(customer.city),
      ownership: OWNERSHIP_MAP[customer.ownershipStatus] ?? customer.ownershipStatus,
      address: customer.address,
    },
    property: {
      type: capitalizeCity(property.propertyType),
      kva: property.requiredKva,
      roofType: capitalizeCity(property.roofType),
      roofSize: property.roofAreaSqft,
      disco: capitalizeCity(property.disco),
      backupHours: property.backupHours || "0",
      siteSurvey: property.siteSurveyRequired ? "Yes" : "No",
      description: property.description,
    },
    documents: docUrls,
    additional: {
      prefDate: additional.preferredDate,
      budget: additional.budgetRange,
      notes: additional.notes,
    },
  };
}

// ─── Async thunk: submit the lead to the backend ──────────────────────────────
export const submitLead = createAsyncThunk(
  "requests/submitLead",
  async ({ companyId, formData, documentUrls }, { rejectWithValue }) => {
    try {
      const payload = buildLeadPayload(formData, companyId, documentUrls);
      const result = await createLead(payload);
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message ?? "Failed to submit request. Please try again.";
      return rejectWithValue(message);
    }
  },
);

// ─── Initial form shape ───────────────────────────────────────────────────────
const initialFormData = {
  selectedCompanyIds: [], // company ids chosen in the company-selection step
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cnic: "",
    city: "",
    address: "",
    ownershipStatus: "",
  },
  property: {
    propertyType: "",
    requiredKva: "",
    roofType: "",
    roofAreaSqft: "",
    disco: "",
    description: "",
    siteSurveyRequired: "",
    backupBattery: false,
    backupHours: "",
  },
  documents: { electricityBill: [], roofImages: [], propertyFront: [], siteVideo: [] },
  additional: { preferredDate: "", budgetRange: "", notes: "" },
};

const initialState = {
  currentStep: 0,
  formData: initialFormData,
  skipCompanyStep: false, // true when the flow was started from a company row
  sourceCompanyName: null, // set when the flow was started from a company row
  submittedRequests: [], // [{ id, createdAt, status, ...formData }]
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      state.currentStep += 1;
    },
    prevStep(state) {
      state.currentStep = Math.max(0, state.currentStep - 1);
    },
    updateFormData(state, action) {
      // action.payload: { section: "customer", data: {...} }
      const { section, data } = action.payload;
      if (section === "customer" && data.city !== undefined && data.city !== state.formData.customer.city) {
        state.formData.property.disco = "";
      }
      state.formData[section] = { ...state.formData[section], ...data };
    },
    toggleSelectedCompany(state, action) {
      const id = action.payload;
      state.formData.selectedCompanyIds = state.formData.selectedCompanyIds.includes(id)
        ? state.formData.selectedCompanyIds.filter((cid) => cid !== id)
        : [...state.formData.selectedCompanyIds, id];
    },
    // Start a fresh quotation form. `skipCompanyStep` lets callers hide
    // the company-selection step (e.g. when launched from a company row).
    initForm(state, action) {
      const {
        step = 0,
        companyIds = [],
        sourceCompanyName = null,
        skipCompanyStep = false,
      } = action.payload || {};
      state.formData = {
        ...initialFormData,
        selectedCompanyIds: [...companyIds],
      };
      state.currentStep = step;
      state.skipCompanyStep = skipCompanyStep;
      state.sourceCompanyName = sourceCompanyName;
    },
    resetForm(state) {
      state.formData = initialFormData;
      state.currentStep = 0;
      state.skipCompanyStep = false;
      state.sourceCompanyName = null;
      state.status = "idle";
      state.error = null;
    },
    setSubmittedRequests(state, action) {
      state.submittedRequests = action.payload;
    },
    addSubmittedRequest(state, action) {
      state.submittedRequests.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLead.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitLead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.submittedRequests.unshift({
          id: action.payload?._id ?? `req_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: "pending",
          ...state.formData,
        });
      })
      .addCase(submitLead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  updateFormData,
  toggleSelectedCompany,
  initForm,
  resetForm,
  setSubmittedRequests,
  addSubmittedRequest,
} = requestsSlice.actions;
export default requestsSlice.reducer;
