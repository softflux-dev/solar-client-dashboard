import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FormField({ label, htmlFor, error, children, className }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && <p id={`${htmlFor}-error`} className="text-xs leading-relaxed text-destructive">{error}</p>}
    </div>
  );
}
