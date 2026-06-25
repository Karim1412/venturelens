"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scoreColor, DIMENSION_LABELS } from "@/lib/utils";
import { CheckCircle, Lightbulb, XCircle } from "lucide-react";

interface DimensionCardProps {
  type: "communication" | "narrative" | "problemSolution";
  data: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  extra?: React.ReactNode;
  index: number;
}

export function DimensionCard({ type, data, extra, index }: DimensionCardProps) {
  const label = DIMENSION_LABELS[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
    >
      <Card variant="gradient" className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">{label}</h3>
            <span
              className={`text-lg font-bold ${scoreColor(data.score)}`}
            >
              {data.score}/100
            </span>
          </div>

          <Progress value={data.score} className="mb-6" size="sm" />

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-2">
                <CheckCircle className="w-3 h-3" />
                Strengths
              </div>
              <ul className="space-y-1">
                {data.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-emerald-500/50 mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-rose-400 font-medium mb-2">
                <XCircle className="w-3 h-3" />
                Weaknesses
              </div>
              <ul className="space-y-1">
                {data.weaknesses.map((s, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-rose-500/50 mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-2">
                <Lightbulb className="w-3 h-3" />
                Suggestions
              </div>
              <ul className="space-y-1">
                {data.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-amber-500/50 mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {extra && <div className="mt-4 pt-4 border-t border-border">{extra}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
