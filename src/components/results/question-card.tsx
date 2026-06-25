"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, AlertCircle } from "lucide-react";

interface QuestionCardProps {
  question: string;
  context: string;
  difficulty: string;
  index: number;
}

export function QuestionCard({
  question,
  context,
  difficulty,
  index,
}: QuestionCardProps) {
  const difficultyColor = {
    Basic: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  }[difficulty] || "bg-gray-500/10 text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="glass" className="hover:border-venture-500/20 transition-all">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-venture-500/10 border border-venture-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4 text-venture-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-200">
                  Question {index + 1}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColor}`}
                >
                  {difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                {question}
              </p>
              {context && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400/70 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-400/70 leading-relaxed">
                    {context}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
