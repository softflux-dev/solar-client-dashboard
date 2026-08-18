import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, MapPin, Phone, Star } from "lucide-react";

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
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {/* Identity */}
        <div className="flex flex-1 items-center gap-3">
          <CompanyLogo company={company} className="w-24 h-24" />
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold leading-tight">
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
            {/* Contact info */}
            <div className="hidden flex-col gap-1 md:flex pt-2">
              <p
                className="flex items-center gap-2 text-sm text-muted-foreground"
                dir="ltr"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{company.phone}</span>
              </p>
              <p
                className="flex items-center gap-2 text-sm text-muted-foreground"
                dir="ltr"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="truncate text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {company.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <CompanyRowActions
          company={company}
          selectable={selectable}
          selected={selected}
          isFavorite={isFavorite}
          onToggleSelect={onToggleSelect}
          onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
          onExpand={handleExpand}
          onGetQuotations={handleGetQuotations}
        />
      </div>

      {/* Expandable detail section */}
      {!selectable && expanded && (
        <CompanyRowDetails company={company} onSeeLess={handleExpand} />
      )}
    </Card>
  );
}
