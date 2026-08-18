import { formatLongDate } from "@/lib/date";

const QUOTATION_TYPE_LABEL_KEYS = {
  document_signature: "dashboard.quotationTypes.documentSignature",
  quotation_approval: "dashboard.quotationTypes.quotationApproval",
};

function quotationTypeLabel(t, type) {
  return t(QUOTATION_TYPE_LABEL_KEYS[type] || "dashboard.quotationTypes.documentSignature");
}

// Shared "Document Signature · Due 12 October 2023" subtitle shape used by
// the Pending Approvals rows, Recent Notifications and the notification menu.
// The date stays dynamic and localized to the active language.
export function quotationDueSubtitle(t, i18n, type, dueDate) {
  const typeLabel = quotationTypeLabel(t, type);
  const date = formatLongDate(dueDate, i18n.language);
  return `${typeLabel} · ${t("dashboard.dueDate", { date })}`;
}
