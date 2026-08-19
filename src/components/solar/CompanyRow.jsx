import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Mail, Phone, Star } from "lucide-react";

import CompanyLogo from "@/components/solar/CompanyLogo";
import CompanyRowActions from "@/components/solar/CompanyRowActions";
import CompanyRowDetails from "@/components/solar/CompanyRowDetails";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  toggleFavorite,
  setExpandedCompany,
  setSelectedCompany,
} from "@/store/slices/solarRequestsSlice";

export default function CompanyRow({
  company,
  selectable = false,
  selected = false,
  onToggleSelect,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [descExpanded, setDescExpanded] = useState(false);

  const expanded = useSelector(
    (state) => state.solarRequests.expandedCompanyId === company.id,
  );
  const isFavorite = useSelector((state) =>
    state.solarRequests.favoriteCompanyIds.includes(company.id),
  );

  const handleExpand = () => {
    dispatch(setExpandedCompany(expanded ? null : company.id));
  };

  const handleGetQuotations = () => {
    // Store the chosen company, then start the quotation flow
    // skipping the company-selection step.
    dispatch(setSelectedCompany(company.id));
    navigate("/requests/new");
  };

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        selectable && "cursor-pointer",
        selectable && selected && "border-primary ring-2 ring-primary/30",
      )}
      onClick={selectable ? () => onToggleSelect?.(company.id) : undefined}
    >
      <div className={cn("flex flex-col p-4 sm:flex-row sm:items-start", expanded ? "gap-2 pb-1" : "gap-4")}>
        {/* Identity — logo grows when expanded */}
        <div className={cn("flex flex-1 items-start gap-4", expanded && "gap-5")}>
          <CompanyLogo
            company={company}
            className={cn(
              "shrink-0 transition-all duration-300",
              expanded ? "h-32 w-32" : "h-24 w-24",
            )}
          />
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "truncate font-bold leading-tight",
                expanded ? "text-2xl" : "text-xl",
              )}
            >
              {company.name}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                {company.region}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {company.projects} {t("solar.projects")}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <Star className="h-3.5 w-3.5 fill-status-active text-status-active" />
                {company.rating.toFixed(1)}
              </span>
            </p>

            {/* Contact info — always shown */}
            <div className="flex flex-col gap-1 pt-2">
              <p
                className="flex items-center gap-2 text-sm text-muted-foreground"
                dir="ltr"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{company.phone}</span>
              </p>
              <p
                className="flex items-center gap-2 text-sm text-muted-foreground"
                dir="ltr"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {company.email}
                </a>
              </p>
            </div>

            {/* Description — merged inline when expanded */}
            {expanded && (
              <div className="mt-3">
                <p className="text-sm font-bold text-foreground">
                  {t("solar.description", "Description")}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-sm leading-relaxed text-muted-foreground",
                    !descExpanded && "crd-desc-clamped",
                  )}
                >
                  {company.description}
                </p>
                {company.description && company.description.length > 200 && (
                  <button
                    type="button"
                    className="crd-read-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDescExpanded((v) => !v);
                    }}
                  >
                    {descExpanded
                      ? t("solar.readLess", "Read less...")
                      : t("solar.readMore", "Read more...")}
                  </button>
                )}
              </div>
            )}

            {/* See more toggle — only when collapsed */}
            {!selectable && !expanded && (
              <button
                type="button"
                onClick={handleExpand}
                aria-expanded={expanded}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {t("solar.seeMore")}
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </button>
            )}
          </div>
        </div>

        {/* Actions — when expanded, only the favourite heart is shown here;
            View Detail / Get Quotations / Chat live in the expanded panel */}
        <CompanyRowActions
          company={company}
          selectable={selectable}
          selected={selected}
          isFavorite={isFavorite}
          expanded={expanded}
          onToggleSelect={onToggleSelect}
          onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
          onExpand={handleExpand}
          onGetQuotations={handleGetQuotations}
        />
      </div>

      {/* Expandable section — image tiles + action bar + See Less */}
      {!selectable && expanded && (
        <div className="px-4 pt-0 pb-2">
          <CompanyRowDetails
            company={company}
            onCollapse={handleExpand}
            onExpand={handleExpand}
            onGetQuotations={handleGetQuotations}
          />
        </div>
      )}
    </Card>
  );
}