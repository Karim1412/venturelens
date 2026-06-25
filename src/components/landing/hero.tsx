"use client";

import { motion } from "framer-motion";
import { Upload, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-venture-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-venture-500/10 border border-venture-500/20 text-venture-400 text-sm mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Pitch Deck Analysis
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          Understand How{" "}
          <span className="gradient-text">Investors</span> See
          <br />
          Your Startup
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your pitch deck and receive a venture-grade evaluation powered
          by AI. Get actionable insights from an investor perspective.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Deck
            </Button>
          </Link>
          <Link href="/results/sample-demo">
            <Button variant="outline" size="lg" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Try Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-600 text-xs">
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
