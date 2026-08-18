import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function ProjectProgress({ value, className }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Progress value={value} className="flex-1" />
      <span className="w-10 shrink-0 text-end text-xs font-semibold text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}
