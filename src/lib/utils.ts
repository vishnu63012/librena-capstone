import { Library } from "@/lib/type";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to conditionally merge Tailwind CSS class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/**
 * Utility to count libraries by their category
 */
export function countLibrariesByCategory(libraries: Library[]) {
  const counts: Record<string, number> = {};
  for (const lib of libraries) {
    if (!lib.category) continue;
    counts[lib.category] = (counts[lib.category] || 0) + 1;
  }
  return counts;
}
