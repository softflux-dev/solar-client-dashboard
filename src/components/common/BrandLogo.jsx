import brandLogo from "@/assets/icons/brandLogo.svg";
import { cn } from "@/lib/utils";

export default function BrandLogo({ className }) {
  return <img src={brandLogo} alt="" aria-hidden="true" className={cn("h-8 w-auto", className)} />;
}
