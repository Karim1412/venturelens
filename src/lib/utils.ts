import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}

export function scoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/20 border-amber-500/30";
  return "bg-rose-500/20 border-rose-500/30";
}

export function scoreRingColor(score: number): string {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  return "#fb7185";
}

export function verdictColor(verdict: string): string {
  switch (verdict) {
    case "Strong Investment Opportunity":
      return "text-emerald-400";
    case "Promising but Needs Improvement":
      return "text-amber-400";
    case "High Risk / Weak Investment Case":
      return "text-rose-400";
    default:
      return "text-gray-400";
  }
}

export function verdictBgColor(verdict: string): string {
  switch (verdict) {
    case "Strong Investment Opportunity":
      return "bg-emerald-500/10 border-emerald-500/20";
    case "Promising but Needs Improvement":
      return "bg-amber-500/10 border-amber-500/20";
    case "High Risk / Weak Investment Case":
      return "bg-rose-500/10 border-rose-500/20";
    default:
      return "bg-gray-500/10 border-gray-500/20";
  }
}

export const DIMENSION_LABELS: Record<string, string> = {
  communication: "Communication & Clarity",
  narrative: "Narrative & Storytelling",
  problemSolution: "Problem-Solution Fit",
};
