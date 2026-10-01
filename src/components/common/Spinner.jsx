import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({ className }) {
  return <Loader2 aria-hidden="true" className={cn("h-4 w-4 shrink-0 motion-safe:animate-spin", className)} />;
}
