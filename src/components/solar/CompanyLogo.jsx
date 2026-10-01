import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CompanyLogo({ company, className }) {
  const [error, setError] = useState(false);

  if (error || !company.logo) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center rounded-md font-semibold text-muted-foreground",
          className
        )}
      >
        {company.name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      <img
        src={company.logo}
        alt={company.name}
        loading="lazy"
        onError={() => setError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
