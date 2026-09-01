import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { updateFormData } from "@/store/slices/requestsSlice";
import FormField from "@/components/common/FormField";
import StepHeader from "@/components/features/requests/StepHeader";
import ValidationErrors from "@/components/common/ValidationErrors";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CITIES = [
  { value: "karachi", labelKey: "requestForm.customer.cities.karachi" },
  { value: "lahore", labelKey: "requestForm.customer.cities.lahore" },
  { value: "islamabad", labelKey: "requestForm.customer.cities.islamabad" },
  { value: "rawalpindi", labelKey: "requestForm.customer.cities.rawalpindi" },
  { value: "faisalabad", labelKey: "requestForm.customer.cities.faisalabad" },
  { value: "multan", labelKey: "requestForm.customer.cities.multan" },
  { value: "peshawar", labelKey: "requestForm.customer.cities.peshawar" },
];

const OWNERSHIP_STATUSES = [
  { value: "own", labelKey: "requestForm.customer.ownershipTypes.own" },
  { value: "rental", labelKey: "requestForm.customer.ownershipTypes.rental" },
];

export default function CustomerInformationStep({ errors = {}, onFieldChange }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.requests.formData.customer);

  const handleChange = (field, value) => {
    dispatch(updateFormData({ section: "customer", data: { [field]: value } }));
    if (onFieldChange) onFieldChange(field, value);
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <StepHeader
        title={t("requestForm.steps.customer")}
        description={t("requestForm.steps.customerHint")}
      />

      <ValidationErrors errors={errors} className="sm:col-span-2" />

      <FormField label={t("requestForm.customer.fullName")} htmlFor="fullName">
        <Input
          id="fullName"
          value={customer.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Ahmed Khan"
        />
      </FormField>

      <FormField label={t("requestForm.customer.email")} htmlFor="email">
        <Input
          id="email"
          type="email"
          value={customer.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="ahmed@example.com"
          dir="ltr"
        />
      </FormField>

      <FormField label={t("requestForm.customer.phone")} htmlFor="phone">
        <Input
          id="phone"
          type="tel"
          value={customer.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+92 300 1234567"
          dir="ltr"
        />
      </FormField>

      <FormField label={t("requestForm.customer.cnic")} htmlFor="cnic">
        <Input
          id="cnic"
          value={customer.cnic}
          onChange={(e) => handleChange("cnic", e.target.value)}
          placeholder="42201-1234567-8"
          dir="ltr"
        />
      </FormField>

      <FormField
        label={t("requestForm.customer.city")}
        htmlFor="city"
      >
        <Select
          value={customer.city}
          onValueChange={(v) => handleChange("city", v)}
        >
          <SelectTrigger id="city">
            <SelectValue
              placeholder={t("requestForm.customer.cityPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map(({ value, labelKey }) => (
              <SelectItem key={value} value={value}>
                {t(labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label={t("requestForm.customer.ownershipStatus")}
        htmlFor="ownershipStatus"
      >
        <Select
          value={customer.ownershipStatus}
          onValueChange={(v) => handleChange("ownershipStatus", v)}
        >
          <SelectTrigger id="ownershipStatus">
            <SelectValue
              placeholder={t("requestForm.customer.ownershipPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {OWNERSHIP_STATUSES.map(({ value, labelKey }) => (
              <SelectItem key={value} value={value}>
                {t(labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label={t("requestForm.customer.address")}
        htmlFor="address"
        className="sm:col-span-2"
      >
        <Input
          id="address"
          value={customer.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="House 12, Street 4, DHA Phase 5"
        />
      </FormField>
    </div>
  );
}