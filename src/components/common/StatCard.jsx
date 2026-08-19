import { cn } from "@/lib/utils";

export default function StatCard({ label, value, icon, highlighted = false, className }) {
  return (
    <div
      className={cn("stat-card", className)}
      data-active={highlighted ? "true" : undefined}
    >
      <div className="flex items-center gap-4">
        <span className="icon-tile icon-tile--grey">
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
          />
        </span>
        <p className="stat-card__label">{label}</p>
      </div>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}
