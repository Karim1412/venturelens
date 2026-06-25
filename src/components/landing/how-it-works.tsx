"use client";

import { motion } from "framer-motion";
import { Upload, Brain, FileText, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Deck",
    description:
      "Drag and drop your PDF or PPTX pitch deck. We support all major formats and extract content automatically.",
  },
  {
    icon: Brain,
    title: "AI Analysis Engine",
    description:
      "Our AI analyzes your deck across communication, narrative, and problem-solution fit dimensions.",
  },
  {
    icon: FileText,
    title: "Investor Report",
    description:
      "Receive a comprehensive evaluation with scores, strengths, risks, and actionable recommendations.",
  },
  {
    icon: BarChart3,
    title: "VC-Ready Insights",
    description:
      "Get the questions investors will ask. Understand exactly what needs improvement before your next pitch.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From upload to investor insights in minutes. No signup required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-surface-50 border border-border hover:border-venture-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-venture-500/10 border border-venture-500/20 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-venture-400" />
                </div>
                <span className="text-2xl font-bold text-venture-500/30 mb-2">
                  0{i + 1}
                </span>
                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-venture-500/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
