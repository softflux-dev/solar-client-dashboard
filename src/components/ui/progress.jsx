import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { useTranslation } from "react-i18next";
import { RTL_LANGUAGES } from "@/i18n/i18n";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  const { i18n } = useTranslation();
  const isRtl = RTL_LANGUAGES.includes(i18n.language);

  // Radix fills LTR-only (translateX toward the left). Mirror the offset for
  // RTL locales so bars fill from the right edge.
  const transform = isRtl
    ? `translateX(${value || 0}%)`
    : `translateX(-${100 - (value || 0)}%)`;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-brand-gradient transition-transform"
        style={{ transform }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
