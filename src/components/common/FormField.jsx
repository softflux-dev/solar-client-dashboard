import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FormField({ label, htmlFor, error, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
