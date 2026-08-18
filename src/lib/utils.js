import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes conditionally without style collisions.
 * Standard shadcn/ui helper used by every ui/* primitive.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
