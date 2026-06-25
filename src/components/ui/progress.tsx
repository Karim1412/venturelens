"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Progress({
  value,
  className,
  barClassName,
  showLabel = false,
  size = "md",
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const colorMap = {
    high: "bg-emerald-500",
    mid: "bg-amber-500",
    low: "bg-rose-500",
  };

  const colorClass =
    clamped >= 70 ? colorMap.high : clamped >= 45 ? colorMap.mid : colorMap.low;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-surface-200 overflow-hidden",
          {
            "h-1.5": size === "sm",
            "h-2": size === "md",
            "h-3": size === "lg",
          }
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass, barClassName)}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-400 min-w-[3ch] text-right">
          {clamped}
        </span>
      )}
    </div>
  );
}
