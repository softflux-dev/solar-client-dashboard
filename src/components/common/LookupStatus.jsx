import { useTranslation } from "react-i18next";

export default function LookupStatus({ lookup, onRetry }) {
  const { t } = useTranslation();
  if (lookup.status === "failed") return (
    <p role="alert" className="text-xs text-destructive">
      {lookup.error}{" "}
      <button type="button" className="underline" onClick={onRetry}>
        {t("common.retry", { defaultValue: "Try again" })}
      </button>
    </p>
  );
  if (lookup.status === "succeeded" && !lookup.items.length) return (
    <p role="status" className="text-xs text-muted-foreground">{t("common.noOptions", { defaultValue: "No options available." })}</p>
  );
  return null;
}
