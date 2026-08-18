import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, ChevronRight, Send } from "lucide-react";

import {
  FORM_STEPS,
  COMPANY_SELECTION_STEP_KEY,
} from "@/components/features/requests/form-steps.config";
import FormStepper from "@/components/features/requests/FormStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { nextStep, prevStep, resetForm, addSubmittedRequest } from "@/store/slices/requestsSlice";

export default function SolarRequestForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector((state) => state.requests.currentStep);
  const formData = useSelector((state) => state.requests.formData);
  const skipCompanyStep = useSelector((state) => state.requests.skipCompanyStep);
  const companies = useSelector((state) => state.solarRequests.companies);

  // When started from a company row, hide the company-selection step.
  const steps = useMemo(
    () =>
      skipCompanyStep
        ? FORM_STEPS.filter((step) => step.key !== COMPANY_SELECTION_STEP_KEY)
        : FORM_STEPS,
    [skipCompanyStep]
  );

  const stepKey = steps[currentStep]?.key;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const StepComponent = steps[currentStep].component;

  const isStepValid = steps[currentStep]?.validate?.(formData) ?? true;

  const selectedCompanies = companies.filter((c) =>
    formData.selectedCompanyIds.includes(c.id)
  );

  const handleSubmit = () => {
    dispatch(
      addSubmittedRequest({
        id: `req_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "pending",
        ...formData,
      })
    );
    dispatch(resetForm());
    navigate("/requests");
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
            <p className="text-sm font-semibold">{t("requestForm.preSelectedNotice")}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {selectedCompanies.map((c) => c.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <StepComponent />
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => dispatch(prevStep())} disabled={isFirstStep}>
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          {t("common.back")}
        </Button>

        {isLastStep ? (
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            {t("common.submit")}
          </Button>
        ) : (
          <Button onClick={() => dispatch(nextStep())} disabled={!isStepValid}>
            {t("common.next")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        )}
      </div>
    </div>
  );
}
