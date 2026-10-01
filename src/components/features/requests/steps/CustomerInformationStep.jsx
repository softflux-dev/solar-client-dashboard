import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchCities } from "@/store/slices/electricitySlice";
import LookupStatus from "@/components/common/LookupStatus";
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

const OWNERSHIP_STATUSES = [
  { value: "own", labelKey: "requestForm.customer.ownershipTypes.own" },
  { value: "rental", labelKey: "requestForm.customer.ownershipTypes.rental" },
];

export default function CustomerInformationStep({ errors = {}, onFieldChange }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.requests.formData.customer);
  const cities = useSelector((state) => state.electricity.cities);
  useEffect(() => { dispatch(fetchCities()); }, [dispatch]);

  const handleChange = (field, value) => {
    if (field === "phone") value = value.replace(/[^\d+ ()-]/g, "").replace(/(?!^)\+/g, "");
    if (field === "cnic") value = value.replace(/[^\d-]/g, "");
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

      <FormField label={t("requestForm.customer.firstName")} htmlFor="firstName" error={errors.firstName}>
        <Input
          id="firstName" aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-error" : undefined}
          value={customer.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder="Ahmed"
        />
      </FormField>

      <FormField label={t("requestForm.customer.lastName")} htmlFor="lastName" error={errors.lastName}>
        <Input
          id="lastName" aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? "lastName-error" : undefined}
          value={customer.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          placeholder="Khan"
        />
      </FormField>

      <FormField label={t("requestForm.customer.email")} htmlFor="email" error={errors.email}>
        <Input
          id="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
          type="email"
          value={customer.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="ahmed@example.com"
          dir="ltr"
        />
      </FormField>

      <FormField label={t("requestForm.customer.phone")} htmlFor="phone" error={errors.phone}>
        <Input
          id="phone" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined}
          type="tel"
          inputMode="tel"
          value={customer.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+92 300 1234567"
          dir="ltr"
        />
      </FormField>

      <FormField label={t("requestForm.customer.cnic")} htmlFor="cnic" error={errors.cnic}>
        <Input
          id="cnic" aria-invalid={!!errors.cnic} aria-describedby={errors.cnic ? "cnic-error" : undefined}
          inputMode="numeric"
          maxLength={15}
          value={customer.cnic}
          onChange={(e) => handleChange("cnic", e.target.value)}
          placeholder="42201-1234567-8"
          dir="ltr"
        />
      </FormField>

      <FormField
        label={t("requestForm.customer.city")}
        htmlFor="city" error={errors.city}
      >
        <Select
          value={customer.city}
          disabled={cities.status !== "succeeded" || !cities.items.length}
          onValueChange={(v) => handleChange("city", v)}
        >
          <SelectTrigger id="city" aria-invalid={!!errors.city} aria-describedby={errors.city ? "city-error" : undefined} loading={cities.status === "idle" || cities.status === "loading"}>
            <SelectValue
              placeholder={t("requestForm.customer.cityPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {cities.items.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <LookupStatus lookup={cities} onRetry={() => dispatch(fetchCities())} />
      </FormField>

      <FormField
        label={t("requestForm.customer.ownershipStatus")}
        htmlFor="ownershipStatus" error={errors.ownershipStatus}
      >
        <Select
          value={customer.ownershipStatus}
          onValueChange={(v) => handleChange("ownershipStatus", v)}
        >
          <SelectTrigger id="ownershipStatus" aria-invalid={!!errors.ownershipStatus} aria-describedby={errors.ownershipStatus ? "ownershipStatus-error" : undefined}>
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
        htmlFor="address" error={errors.address}
        className="sm:col-span-2"
      >
        <Input
          id="address" aria-invalid={!!errors.address} aria-describedby={errors.address ? "address-error" : undefined}
          value={customer.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="House 12, Street 4, DHA Phase 5"
        />
      </FormField>
    </div>
  );
}
