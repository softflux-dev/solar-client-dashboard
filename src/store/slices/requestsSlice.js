import { createSlice } from "@reduxjs/toolkit";

const initialFormData = {
  selectedCompanyIds: [], // company ids chosen in the company-selection step
  customer: {
    fullName: "",
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
  status: "idle",
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
    },
    setSubmittedRequests(state, action) {
      state.submittedRequests = action.payload;
    },
    addSubmittedRequest(state, action) {
      state.submittedRequests.unshift(action.payload);
    },
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
