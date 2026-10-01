import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_LOOKUP, fetchProviders } from "@/store/slices/electricitySlice";
import LookupStatus from "@/components/common/LookupStatus";
import { useDispatch, useSelector } from "react-redux";

import { updateFormData } from "@/store/slices/requestsSlice";
import FormField from "@/components/common/FormField";
import StepHeader from "@/components/features/requests/StepHeader";
import ValidationErrors from "@/components/common/ValidationErrors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROPERTY_TYPES = [
  { value: "residential", labelKey: "requestForm.property.types.residential" },
  { value: "commercial", labelKey: "requestForm.property.types.commercial" },
  { value: "industrial", labelKey: "requestForm.property.types.industrial" },
];

const KVA_OPTIONS = [
  { value: "3", labelKey: "requestForm.property.kva.3" },
  { value: "5", labelKey: "requestForm.property.kva.5" },
  { value: "10", labelKey: "requestForm.property.kva.10" },
  { value: "25_plus", labelKey: "requestForm.property.kva.25_plus" },
];

const ROOF_TYPES = [
  { value: "concrete", labelKey: "requestForm.property.roofTypes.concrete" },
  { value: "metal_sheet", labelKey: "requestForm.property.roofTypes.metal_sheet" },
  { value: "ground", labelKey: "requestForm.property.roofTypes.ground" },
];

const DESCRIPTION_MAX_WORDS = 100;

const SURVEY_OPTIONS = [
  { value: true, labelKey: "requestForm.property.survey.yes" },
  { value: false, labelKey: "requestForm.property.survey.no" },
];

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-border"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
          checked
            ? "translate-x-5 rtl:-translate-x-5"
            : "translate-x-0.5 rtl:-translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function PropertyInformationStep({ errors = {}, onFieldChange }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const property = useSelector((state) => state.requests.formData.property);
  const city = useSelector((state) => state.requests.formData.customer.city);
  const providers = useSelector((state) => state.electricity.providersByCity[city] ?? EMPTY_LOOKUP);
  useEffect(() => { if (city) dispatch(fetchProviders(city)); }, [dispatch, city]);

  const handleChange = (field, value) => {
    dispatch(updateFormData({ section: "property", data: { [field]: value } }));
    if (onFieldChange) onFieldChange(field, value);
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <StepHeader
        title={t("requestForm.steps.property")}
        description={t("requestForm.steps.propertyHint")}
      />

      <ValidationErrors errors={errors} className="sm:col-span-2" />

      <FormField
        label={t("requestForm.property.propertyType")}
        htmlFor="propertyType" error={errors.propertyType}
      >
        <Select
          value={property.propertyType}
          onValueChange={(v) => handleChange("propertyType", v)}
        >
          <SelectTrigger id="propertyType" aria-invalid={!!errors.propertyType} aria-describedby={errors.propertyType ? "propertyType-error" : undefined}>
            <SelectValue
              placeholder={t("requestForm.property.typesPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map(({ value, labelKey }) => (
              <SelectItem key={value} value={value}>
                {t(labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label={t("requestForm.property.requiredKva")} htmlFor="requiredKva" error={errors.requiredKva}>
        <Select
          value={property.requiredKva}
          onValueChange={(v) => handleChange("requiredKva", v)}
        >
          <SelectTrigger id="requiredKva" aria-invalid={!!errors.requiredKva} aria-describedby={errors.requiredKva ? "requiredKva-error" : undefined}>
            <SelectValue placeholder={t("requestForm.property.kvaPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {KVA_OPTIONS.map(({ value, labelKey }) => (
              <SelectItem key={value} value={value}>
                {t(labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label={t("requestForm.property.roofType")} htmlFor="roofType" error={errors.roofType}>
        <Select
          value={property.roofType}
          onValueChange={(v) => handleChange("roofType", v)}
        >
          <SelectTrigger id="roofType" aria-invalid={!!errors.roofType} aria-describedby={errors.roofType ? "roofType-error" : undefined}>
            <SelectValue
              placeholder={t("requestForm.property.roofTypePlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {ROOF_TYPES.map(({ value, labelKey }) => (
              <SelectItem key={value} value={value}>
                {t(labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label={t("requestForm.property.roofArea")}
        htmlFor="roofAreaSqft" error={errors.roofAreaSqft}
      >
        <Input
          id="roofAreaSqft" aria-invalid={!!errors.roofAreaSqft} aria-describedby={errors.roofAreaSqft ? "roofAreaSqft-error" : undefined}
          type="number"
          min="0"
          value={property.roofAreaSqft}
          onChange={(e) => handleChange("roofAreaSqft", e.target.value)}
          placeholder={t("requestForm.property.roofAreaPlaceholder")}
        />
      </FormField>

      <FormField
        label={t("requestForm.property.disco")}
        htmlFor="disco" error={errors.disco}
        className="sm:col-span-2"
      >
        <Select
          value={property.disco}
          disabled={!city || providers.status !== "succeeded" || !providers.items.length}
          onValueChange={(v) => handleChange("disco", v)}
        >
          <SelectTrigger id="disco" aria-invalid={!!errors.disco} aria-describedby={errors.disco ? "disco-error" : undefined} loading={!!city && (providers.status === "idle" || providers.status === "loading")}>
            <SelectValue placeholder={t("requestForm.property.discoPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {providers.items.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <LookupStatus lookup={providers} onRetry={() => dispatch(fetchProviders(city))} />
      </FormField>

      <FormField
        label={t("requestForm.property.description")}
        htmlFor="description" error={errors.description}
        className="sm:col-span-2"
      >
        <Textarea
          id="description" aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined}
          value={property.description}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/).filter(Boolean);
            if (words.length <= DESCRIPTION_MAX_WORDS) {
              handleChange("description", e.target.value);
            }
          }}
          placeholder={t("requestForm.property.descriptionPlaceholder")}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {property.description.trim().split(/\s+/).filter(Boolean).length}/{DESCRIPTION_MAX_WORDS} {t("requestForm.property.wordCount")}
        </p>
      </FormField>

      <FormField
        label={t("requestForm.property.survey.label")}
        htmlFor="siteSurveyRequired" error={errors.siteSurveyRequired}
        className="sm:col-span-2"
      >
        <div className="flex flex-wrap gap-3">
          {SURVEY_OPTIONS.map(({ value, labelKey }) => {
            const isSelected = property.siteSurveyRequired === value;
            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => handleChange("siteSurveyRequired", value)}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                  isSelected
                    ? "border-primary bg-accent font-medium text-foreground"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    isSelected ? "border-primary" : "border-input"
                  )}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                </span>
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </FormField>

      {/* Backup battery question — step footer */}
      <div className="sm:col-span-2 rounded-xl border border-border bg-muted/40 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">
              {t("requestForm.property.backupBattery.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("requestForm.property.backupBattery.question")}
            </p>
          </div>
          <ToggleSwitch
            label={t("requestForm.property.backupBattery.title")}
            checked={property.backupBattery}
            onChange={(v) => handleChange("backupBattery", v)}
          />
        </div>

        {property.backupBattery && (
          <div className="mt-4 border-t border-border pt-4">
            <FormField
              label={t("requestForm.property.backupBattery.hours")}
              htmlFor="backupHours" error={errors.backupHours}
            >
              <Input
                id="backupHours" aria-invalid={!!errors.backupHours} aria-describedby={errors.backupHours ? "backupHours-error" : undefined}
                type="number"
                min="1"
                value={property.backupHours}
                onChange={(e) => handleChange("backupHours", e.target.value)}
                placeholder={t("requestForm.property.backupBattery.hoursPlaceholder")}
              />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}
