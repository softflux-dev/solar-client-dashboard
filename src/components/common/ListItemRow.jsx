import IconTile from "@/components/common/IconTile";

export default function ListItemRow({ icon, title, subtitle, action, iconVariant = "tint" }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <IconTile icon={icon} variant={iconVariant} className="h-10 w-10 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
