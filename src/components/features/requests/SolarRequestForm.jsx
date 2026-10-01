import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";

import {
  FORM_STEPS,
  COMPANY_SELECTION_STEP_KEY,
} from "@/components/features/requests/form-steps.config";
import FormStepper from "@/components/features/requests/FormStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SuccessDialog from "@/components/common/SuccessDialog";
import {
  nextStep,
  prevStep,
  resetForm,
  submitLead,
} from "@/store/slices/requestsSlice";

/**
 * Extract Cloudinary URLs from a documents section.
 * Each field (electricityBill, roofImages, etc.) is an array of file objects.
 * Files that were uploaded have an `uploadedData.url` property.
 */
function extractDocumentUrls(documents) {
  const urls = [];
  for (const field of Object.values(documents)) {
    if (Array.isArray(field)) {
      for (const file of field) {
        if (file.uploadedData?.url) {
          urls.push(file.uploadedData.url);
        }
      }
    }
  }
  return urls;
}

/**
 * Check if all uploaded files have finished uploading.
 * Returns true if no files are in the "uploading" state.
 */
function allUploadsComplete(documents) {
  for (const field of Object.values(documents)) {
    if (Array.isArray(field)) {
      for (const file of field) {
        if (file.uploading) return false;
      }
    }
  }
  return true;
}

export default function SolarRequestForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector((state) => state.requests.currentStep);
  const formData = useSelector((state) => state.requests.formData);
  const skipCompanyStep = useSelector(
    (state) => state.requests.skipCompanyStep,
  );
  const submitStatus = useSelector((state) => state.requests.status);
  const submitError = useSelector((state) => state.requests.error);
  const companies = useSelector((state) => state.solarRequests.companies);

  // When started from a company row, hide the company-selection step.
  const steps = useMemo(
    () =>
      skipCompanyStep
        ? FORM_STEPS.filter((step) => step.key !== COMPANY_SELECTION_STEP_KEY)
        : FORM_STEPS,
    [skipCompanyStep],
  );

  const stepKey = steps[currentStep]?.key;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const StepComponent = steps[currentStep].component;

  const isStepValid = steps[currentStep]?.validate?.(formData) ?? true;

  // Get errors for current step
  const currentStepErrors = useMemo(() => {
    if (!stepKey) return {};
    const getErrors = steps[currentStep]?.getErrors;
    if (!getErrors) return {};
    return getErrors(formData);
  }, [stepKey, currentStep, steps, formData]);

  // Check if documents are still uploading
  const uploadsComplete = allUploadsComplete(formData.documents);

  const selectedCompanies = companies.filter((c) =>
    formData.selectedCompanyIds.includes(c.id),
  );

  const isSubmitting = submitStatus === "loading";

  const [showSuccess, setShowSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  useEffect(() => {
    if (showErrors) document.querySelector('[aria-invalid="true"]')?.focus();
  }, [showErrors]);

  // Clear errors when user changes a field
  const handleFieldChange = useCallback(() => {
    if (showErrors) {
      setShowErrors(false);
    }
  }, [showErrors]);

  const handleSubmit = async () => {
    // Pick the first selected company (or the only one if pre-selected)
    const companyId = formData.selectedCompanyIds[0];
    if (!companyId) return;

    // Extract all Cloudinary URLs from uploaded documents
    const documentUrls = extractDocumentUrls(formData.documents);

    // Dispatch the async thunk — it calls the API and updates Redux state
    const result = await dispatch(
      submitLead({ companyId, formData, documentUrls }),
    );

    // On success, store the API response and show the success dialog
    if (submitLead.fulfilled.match(result)) {
      setApiResponse(result.payload?.message || null);
      setShowSuccess(true);
    }
    // On failure, the error is stored in state.requests.error
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setApiResponse(null);
    dispatch(resetForm());
    navigate("/requests");
  };

  const handleNext = () => {
    if (!isStepValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    dispatch(nextStep());
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {t("requestForm.topTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("requestForm.topSubtitle")}
        </p>
      </div>

      <FormStepper steps={steps} currentStep={currentStep} />

      {skipCompanyStep && selectedCompanies.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-accent p-4">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">
              {t("requestForm.preSelectedNotice")}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {selectedCompanies.map((c) => c.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Show submission error */}
      {submitError && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}

      <Card>
        <CardContent className="p-4 sm:p-6">
          <StepComponent
            errors={showErrors ? currentStepErrors : {}}
            onFieldChange={handleFieldChange}
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => dispatch(prevStep())}
          disabled={isFirstStep || isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          {t("common.back")}
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !uploadsComplete}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? t("common.loading") : t("common.submit")}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {t("common.next")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        )}
      </div>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={handleSuccessClose}
        title={t("requestForm.submitSuccess") ?? "Solar Request Submitted"}
        confirmLabel={t("common.ok") ?? "OK"}
        onConfirm={handleSuccessClose}
        contentClassName="sm:max-w-lg"
      >
        <div className="w-full text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            {t("requestForm.submitSuccessMessage") ??
              "Your solar request has been submitted successfully."}
          </p>
          {apiResponse && (
            <p className="text-sm text-muted-foreground">{apiResponse}</p>
          )}
        </div>
      </SuccessDialog>
    </div>
  );
}
