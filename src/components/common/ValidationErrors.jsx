import { cn } from "@/lib/utils";

export default function ValidationErrors({ errors, className }) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorMessages = Object.values(errors).filter(Boolean);

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border border-destructive/50 bg-destructive/10 p-3",
        className,
      )}
    >
      <ul className="list-disc space-y-1 pl-4 text-sm text-destructive">
        {errorMessages.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
