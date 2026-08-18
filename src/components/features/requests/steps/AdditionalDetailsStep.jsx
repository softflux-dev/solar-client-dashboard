import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { updateFormData } from "@/store/slices/requestsSlice";
import FormField from "@/components/common/FormField";
import StepHeader from "@/components/features/requests/StepHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BUDGET_RANGES = [
  { value: "below_500k", labelKey: "requestForm.additional.budgets.below_500k" },
  { value: "500k_1m", labelKey: "requestForm.additional.budgets.500k_1m" },
  { value: "1m_2m", labelKey: "requestForm.additional.budgets.1m_2m" },
  { value: "2m_5m", labelKey: "requestForm.additional.budgets.2m_5m" },
  { value: "above_5m", labelKey: "requestForm.additional.budgets.above_5m" },
];

export default function AdditionalDetailsStep() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const additional = useSelector((state) => state.requests.formData.additional);

  const handleChange = (field, value) => {
    dispatch(updateFormData({ section: "additional", data: { [field]: value } }));
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <StepHeader
        title={t("requestForm.steps.additional")}
        description={t("requestForm.steps.additionalHint")}
      />
      <FormField
        label={t("requestForm.additional.preferredDate")}
        htmlFor="preferredDate"
      >
        <Input
          id="preferredDate"
          type="date"
          value={additional.preferredDate}
          onChange={(e) => handleChange("preferredDate", e.target.value)}
        />
      </FormField>

      <FormField
        label={t("requestForm.additional.budgetRange")}
        htmlFor="budgetRange"
      >
        <Select
          value={additional.budgetRange}
          onValueChange={(v) => handleChange("budgetRange", v)}
        >
          <SelectTrigger id="budgetRange">
            <SelectValue
              placeholder={t("requestForm.additional.budgetPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_RANGES.map(({ value, labelKey }) => (
              <SelectItem key={value} value={value}>
                {t(labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label={t("requestForm.additional.notes")}
        htmlFor="notes"
        className="sm:col-span-2"
      >
        <Textarea
          id="notes"
          value={additional.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder={t("requestForm.additional.notesHint")}
        />
      </FormField>
    </div>
  );
}
