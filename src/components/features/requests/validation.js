import { z } from "zod";

// ─── Customer Information Schema ──────────────────────────────────────────────
export const customerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format"),
  cnic: z.string().optional(),
  city: z.string().min(1, "City is required"),
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters"),
  ownershipStatus: z.string().min(1, "Ownership status is required"),
});

// ─── Property Information Schema ──────────────────────────────────────────────
export const propertySchema = z
  .object({
    propertyType: z.string().min(1, "Property type is required"),
    requiredKva: z.string().min(1, "Required KVA is required"),
    roofType: z.string().min(1, "Roof type is required"),
    roofAreaSqft: z
      .string()
      .min(1, "Roof area is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Roof area must be a positive number",
      }),
    disco: z.string().min(1, "DISCO is required"),
    description: z.string().optional(),
    siteSurveyRequired: z.boolean({
      required_error: "Site survey preference is required",
    }),
    backupBattery: z.boolean().default(false),
    backupHours: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.backupBattery) {
        return (
          data.backupHours !== undefined &&
          data.backupHours !== "" &&
          !isNaN(Number(data.backupHours)) &&
          Number(data.backupHours) > 0
        );
      }
      return true;
    },
    {
      message: "Backup hours are required when backup battery is enabled",
      path: ["backupHours"],
    },
  );

// ─── Company Selection Schema ─────────────────────────────────────────────────
export const companiesSchema = z.object({
  selectedCompanyIds: z
    .array(z.string())
    .min(1, "Please select at least one company"),
});

// ─── Document Upload Schema ───────────────────────────────────────────────────
export const documentsSchema = z.object({
  electricityBill: z
    .array(z.any())
    .min(1, "Electricity bill is required"),
  roofImages: z.array(z.any()).min(1, "At least one roof image is required"),
  propertyFront: z
    .array(z.any())
    .min(1, "Property front image is required"),
  siteVideo: z.array(z.any()).optional(),
});

// ─── Additional Details Schema ────────────────────────────────────────────────
export const additionalSchema = z.object({
  preferredDate: z.string().optional(),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Combined Form Schema ─────────────────────────────────────────────────────
export const formSchema = z.object({
  customer: customerSchema,
  property: propertySchema,
  selectedCompanyIds: z.array(z.string()).min(1),
  documents: documentsSchema,
  additional: additionalSchema,
});

// ─── Validation Helpers ───────────────────────────────────────────────────────
export function validateStep(stepKey, formData) {
  const schemas = {
    customer: customerSchema,
    property: propertySchema,
    companies: companiesSchema,
    documents: documentsSchema,
    additional: additionalSchema,
  };

  const schema = schemas[stepKey];
  if (!schema) return { success: true, errors: {} };

  const dataToValidate =
    stepKey === "companies"
      ? { selectedCompanyIds: formData.selectedCompanyIds }
      : formData[stepKey];

  const result = schema.safeParse(dataToValidate);

  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return { success: false, errors };
}

export function getStepErrors(stepKey, formData) {
  const { errors } = validateStep(stepKey, formData);
  return errors;
}
