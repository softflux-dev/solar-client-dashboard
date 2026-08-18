import { useTranslation } from "react-i18next";

export default function CompanyRowDetails({ company, onSeeLess }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 border-t border-border p-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {company.description}
      </p>

      <div>
        <h4 className="mb-2 text-sm font-semibold">{t("solar.projectImages")}</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {company.images.slice(0, 4).map((src, index) => (
            <div
              key={index}
              className="group/img relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img
                src={src}
                alt={`${company.name} project ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {index === 3 && (
                <button
                  type="button"
                  title={t("solar.viewMoreImages")}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-semibold text-white transition-colors hover:bg-black/60"
                >
                  {t("solar.viewMore")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onSeeLess}
        className="text-sm font-medium text-primary hover:underline"
      >
        {t("solar.seeLess")}
      </button>
    </div>
  );
}
