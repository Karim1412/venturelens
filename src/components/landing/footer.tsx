"use client";

import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-venture-400" />
          <span className="text-sm font-medium">VentureLens AI</span>
        </div>
        <p className="text-xs text-gray-600">
          AI-powered pitch deck evaluation for founders and investors.
        </p>
      </div>
    </footer>
  );
}
