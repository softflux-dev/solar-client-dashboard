import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function FormStepper({ steps, currentStep }) {
  const { t } = useTranslation();
  // Completed fraction only — matches the desktop stepper, where the current
  // (in-progress) step is never counted as complete.
  const progressValue = steps.length
    ? (currentStep / steps.length) * 100
    : 0;
  const currentLabel = steps[currentStep]?.labelKey
    ? t(steps[currentStep].labelKey)
    : "";

  return (
    <div className="mb-8">
      {/* Mobile: compact progress bar + label */}
      <div className="mb-4 rounded-md bg-card p-4 lg:hidden">
        <p className="mb-2 text-sm text-muted-foreground">
          {t("requestForm.stepOf", {
            current: currentStep + 1,
            total: steps.length,
          })}
          {currentLabel && (
            <span className="font-medium text-foreground"> — {currentLabel}</span>
          )}
        </p>
        <Progress value={progressValue} />
      </div>

{/* Desktop: full step list */}
      <ol className="hidden rounded-md bg-card p-4 lg:flex">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.key}
              aria-current={isCurrent ? "step" : undefined}
              className="flex flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    index === 0
                      ? "bg-transparent"
                      : index - 1 < currentStep
                        ? "bg-primary"
                        : "bg-border",
                  )}
                />
                <div
                  title={t(step.labelKey)}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    isComplete &&
                      "border-transparent bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isComplete &&
                      !isCurrent &&
                      "border-border text-muted-foreground",
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    isLast
                      ? "bg-transparent"
                      : isComplete
                        ? "bg-primary"
                        : "bg-border",
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2 px-2 text-center text-xs font-medium leading-relaxed",
                  isCurrent || isComplete
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {t(step.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
