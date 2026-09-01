import CustomerInformationStep from "@/components/features/requests/steps/CustomerInformationStep";
import PropertyInformationStep from "@/components/features/requests/steps/PropertyInformationStep";
import CompanySelectionStep from "@/components/features/requests/steps/CompanySelectionStep";
import DocumentUploadStep from "@/components/features/requests/steps/DocumentUploadStep";
import AdditionalDetailsStep from "@/components/features/requests/steps/AdditionalDetailsStep";
import { validateStep } from "@/components/features/requests/validation";

// Add/remove/reorder steps here only — FormStepper and SolarRequestForm
// read this array, nothing else needs to change.
//
// Company Selection is only shown for the generic "Get Quotations" flow.
// When the flow is started from a specific company, SolarRequestForm
// filters this step out so it is skipped.
export const FORM_STEPS = [
  {
    key: "customer",
    labelKey: "requestForm.steps.customer",
    component: CustomerInformationStep,
    validate: (formData) => {
      const result = validateStep("customer", formData);
      return result.success;
    },
    getErrors: (formData) => {
      const result = validateStep("customer", formData);
      return result.errors;
    },
  },
  {
    key: "property",
    labelKey: "requestForm.steps.property",
    component: PropertyInformationStep,
    validate: (formData) => {
      const result = validateStep("property", formData);
      return result.success;
    },
    getErrors: (formData) => {
      const result = validateStep("property", formData);
      return result.errors;
    },
  },
  {
    key: "companies",
    labelKey: "requestForm.steps.companies",
    component: CompanySelectionStep,
    validate: (formData) => {
      const result = validateStep("companies", formData);
      return result.success;
    },
    getErrors: (formData) => {
      const result = validateStep("companies", formData);
      return result.errors;
    },
  },
  {
    key: "documents",
    labelKey: "requestForm.steps.documents",
    component: DocumentUploadStep,
    validate: (formData) => {
      const result = validateStep("documents", formData);
      return result.success;
    },
    getErrors: (formData) => {
      const result = validateStep("documents", formData);
      return result.errors;
    },
  },
  {
    key: "additional",
    labelKey: "requestForm.steps.additional",
    component: AdditionalDetailsStep,
    validate: (formData) => {
      const result = validateStep("additional", formData);
      return result.success;
    },
    getErrors: (formData) => {
      const result = validateStep("additional", formData);
      return result.errors;
    },
  },
];

export const COMPANY_SELECTION_STEP_KEY = "companies";
