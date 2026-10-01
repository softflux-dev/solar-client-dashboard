import { useTranslation } from "react-i18next";
import Spinner from "@/components/common/Spinner";

export default function CompanyListSkeleton() {
  const { t } = useTranslation();
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner />{t("common.loading")}</p>
      {[0, 1, 2].map((row) => (
        <div key={row} aria-hidden="true" className="flex gap-4 rounded-lg border bg-card p-4 motion-safe:animate-pulse">
          <div className="h-16 w-16 shrink-0 rounded-md bg-muted sm:h-24 sm:w-24" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 w-2/3 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
