import CustomerInformationStep from "@/components/features/requests/steps/CustomerInformationStep";
import PropertyInformationStep from "@/components/features/requests/steps/PropertyInformationStep";
import CompanySelectionStep from "@/components/features/requests/steps/CompanySelectionStep";
import DocumentUploadStep from "@/components/features/requests/steps/DocumentUploadStep";
import AdditionalDetailsStep from "@/components/features/requests/steps/AdditionalDetailsStep";

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
      const { fullName, email, phone, city, address, ownershipStatus } =
        formData.customer;
      return Boolean(
        fullName.trim() &&
          email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
          phone.trim() &&
          city.trim() &&
          address.trim() &&
          ownershipStatus.trim()
      );
    },
  },
  {
    key: "property",
    labelKey: "requestForm.steps.property",
    component: PropertyInformationStep,
    validate: (formData) => {
      const {
        propertyType,
        requiredKva,
        roofType,
        roofAreaSqft,
        disco,
        siteSurveyRequired,
      } = formData.property;
      return Boolean(
        propertyType.trim() &&
          requiredKva.trim() &&
          roofType.trim() &&
          roofAreaSqft.trim() &&
          disco.trim() &&
          siteSurveyRequired !== ""
      );
    },
  },
  {
    key: "companies",
    labelKey: "requestForm.steps.companies",
    component: CompanySelectionStep,
    validate: (formData) => formData.selectedCompanyIds.length > 0,
  },
  {
    key: "documents",
    labelKey: "requestForm.steps.documents",
    component: DocumentUploadStep,
    validate: (formData) => {
      const { electricityBill, roofImages, propertyFront } = formData.documents;
      return (
        electricityBill.length > 0 &&
        roofImages.length > 0 &&
        propertyFront.length > 0
      );
    },
  },
  {
    key: "additional",
    labelKey: "requestForm.steps.additional",
    component: AdditionalDetailsStep,
  },
];

export const COMPANY_SELECTION_STEP_KEY = "companies";
