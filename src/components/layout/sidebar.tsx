"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  History,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Upload, label: "New Analysis", href: "/dashboard" },
  { icon: LayoutDashboard, label: "Demo", href: "/results/sample-demo" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-50 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <motion.div
          animate={{ rotate: collapsed ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-6 h-6 text-venture-400" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-semibold text-sm tracking-tight"
            >
              VentureLens
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-venture-600/10 text-venture-400 border border-venture-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-surface-100 border border-transparent",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-surface-100"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
