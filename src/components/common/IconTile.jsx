import { cn } from "@/lib/utils";

const variantClass = {
  tint: "icon-tile--tint",
  gradient: "icon-tile--gradient",
  primary: "icon-tile--primary",
};

export default function IconTile({ icon, variant = "tint", className }) {
  const Icon = typeof icon === "string" ? null : icon;

  return (
    <div
      className={cn(
        "icon-tile",
        variantClass[variant] ?? variantClass.tint,
        className
      )}
    >
      {Icon ? (
        <Icon className="h-5 w-5" />
      ) : (
        <img src={icon} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
      )}
    </div>
  );
}
