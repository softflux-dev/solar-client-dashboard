import { Button } from "@/components/ui/button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card px-5 py-12 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="max-w-md space-y-2">
        <p className="font-medium">{title}</p>
        {description && <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
