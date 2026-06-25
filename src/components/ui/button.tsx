"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-venture-500/40 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-venture-600 text-white hover:bg-venture-500 active:bg-venture-700 shadow-lg shadow-venture-600/20":
              variant === "primary",
            "bg-surface-100 text-gray-200 hover:bg-surface-200 border border-border":
              variant === "secondary",
            "text-gray-400 hover:text-gray-200 hover:bg-surface-100": variant === "ghost",
            "border border-border text-gray-300 hover:bg-surface-100 hover:border-venture-500/40":
              variant === "outline",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-5 py-2.5 text-sm": size === "md",
            "px-7 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
