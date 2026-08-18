import IconTile from "@/components/common/IconTile";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, icon, highlighted = false, className }) {
  return (
    <div
      className={cn("stat-card", className)}
      data-active={highlighted ? "true" : undefined}
    >
      <div className="min-w-0">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
      <IconTile icon={icon} variant={highlighted ? "gradient" : "tint"} />
    </div>
  );
}
