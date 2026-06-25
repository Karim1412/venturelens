"use client";

import { motion } from "framer-motion";
import { MessageSquare, BookOpen, Target } from "lucide-react";

const dimensions = [
  {
    icon: MessageSquare,
    title: "Communication & Deck Clarity",
    items: [
      "Grammar & spelling analysis",
      "Writing quality & readability",
      "Slide clarity & conciseness",
      "Information overload detection",
    ],
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    icon: BookOpen,
    title: "Narrative & Founder Storytelling",
    items: [
      "Story flow & structure",
      "Missing section detection",
      "Narrative coherence scoring",
      "Persuasiveness & vision",
    ],
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  {
    icon: Target,
    title: "Problem-Solution Fit",
    items: [
      "Pain severity analysis",
      "Market relevance check",
      "Solution logic validation",
      "Scalability assessment",
    ],
    color: "text-rose-400",
    border: "border-rose-500/20",
    bg: "bg-rose-500/5",
  },
];

export function Framework() {
  return (
    <section id="framework" className="py-32 px-6 bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Evaluation Framework
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Three dimensions. One comprehensive investor-grade assessment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {dimensions.map((dim, i) => (
            <motion.div
              key={dim.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-xl border ${dim.border} ${dim.bg} p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <dim.icon className={`w-5 h-5 ${dim.color}`} />
                <h3 className="font-semibold text-sm">{dim.title}</h3>
              </div>
              <ul className="space-y-2">
                {dim.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-gray-400 flex items-center gap-2"
                  >
                    <span className={`w-1 h-1 rounded-full ${dim.color.replace("text", "bg")}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
