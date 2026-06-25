"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SampleReport() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-border max-w-4xl mx-auto"
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="text-xs uppercase tracking-widest text-venture-400 font-medium">
                  Sample Report
                </span>
                <h3 className="text-2xl font-bold mt-2 mb-3">
                  See what investors will think
                </h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  We analyzed SupportAI, an AI customer support platform. The
                  result is a complete investor report with scores, risks, and
                  the exact questions VCs would ask.
                </p>
                <Link href="/results/sample-demo">
                  <Button className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Sample Report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="w-32 h-32 rounded-full bg-venture-500/10 border-2 border-venture-500/20 flex items-center justify-center shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">72</div>
                  <div className="text-xs text-gray-500 mt-1">Score</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
