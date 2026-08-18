import { cn } from "@/lib/utils";

export default function IconTile({ icon: Icon, variant = "tint", className }) {
  return (
    <div
      className={cn(
        "icon-tile",
        variant === "gradient" ? "icon-tile--gradient" : "icon-tile--tint",
        className
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
