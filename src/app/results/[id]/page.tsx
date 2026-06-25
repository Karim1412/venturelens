"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { ScoreRing } from "@/components/results/score-ring";
import { RadarChart } from "@/components/results/radar-chart";
import { DimensionCard } from "@/components/results/dimension-card";
import { QuestionCard } from "@/components/results/question-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { SAMPLE_REPORT } from "@/services/sampleData";
import { InvestorReport } from "@/types";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Sparkles,
  ArrowLeft,
  Download,
  Share2,
  FileText,
  Building2,
  AlertCircle,
} from "lucide-react";
import { verdictColor, verdictBgColor, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

function VerdictBadge({ verdict }: { verdict: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${verdictBgColor(verdict)} ${verdictColor(verdict)}`}
    >
      <Target className="w-3 h-3" />
      {verdict}
    </span>
  );
}

function OverviewSection({ report }: { report: InvestorReport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-3 gap-8 mb-12"
    >
      <div className="flex flex-col items-center justify-center">
        <ScoreRing score={report.overallScore} label="Overall Score" />
      </div>

      <div className="md:col-span-2 flex flex-col justify-center">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {report.startupName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{report.tagline}</p>
          </div>
          <VerdictBadge verdict={report.verdict} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Investment Readiness</span>
            <span>{report.overallScore}/100</span>
          </div>
          <Progress value={report.overallScore} size="lg" showLabel={false} />
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {report.deckOverview.totalSlides} slides
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {report.deckOverview.detectedCategories.length} sections detected
          </span>
          <span>{formatDate(report.generatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TopStrengthsRisks({ report }: { report: InvestorReport }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="gradient" className="border-emerald-500/10 h-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">Top Strengths</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.topStrengths.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-400">
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-sm text-gray-300">{s}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="gradient" className="border-rose-500/10 h-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-rose-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-semibold">Top Risks</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.topRisks.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-rose-400">
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-sm text-gray-300">{s}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function CriticalImprovement({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-400 mb-1">
                Most Critical Improvement
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RadarSection({ report }: { report: InvestorReport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-venture-400" />
            <h2 className="text-sm font-semibold">
              Multi-Dimensional Analysis
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <RadarChart data={report.radarData} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DimensionSections({ report }: { report: InvestorReport }) {
  return (
    <div className="space-y-6 mb-12">
      <DimensionCard
        type="communication"
        data={{
          score: report.communication.score,
          strengths: report.communication.strengths,
          weaknesses: report.communication.weaknesses,
          suggestions: report.communication.suggestions,
        }}
        index={0}
        extra={
          <Collapsible title="Grammar & Clarity Details">
            <div className="space-y-3 pt-3">
              <div>
                <p className="text-xs text-rose-400 font-medium mb-1">
                  Grammar Issues
                </p>
                <ul className="space-y-1">
                  {report.communication.grammarIssues.map((g, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-rose-500/50">•</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-amber-400 font-medium mb-1">
                  Clarity Issues
                </p>
                <ul className="space-y-1">
                  {report.communication.clarityIssues.map((c, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-amber-500/50">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Collapsible>
        }
      />

      <DimensionCard
        type="narrative"
        data={{
          score: report.narrative.score,
          strengths: report.narrative.strengths,
          weaknesses: report.narrative.weaknesses,
          suggestions: report.narrative.suggestions,
        }}
        index={1}
        extra={
          <Collapsible title="Missing Elements & Story Flow">
            <div className="space-y-3 pt-3">
              <div>
                <p className="text-xs text-rose-400 font-medium mb-1">
                  Missing Elements
                </p>
                <ul className="space-y-1">
                  {report.narrative.missingElements.map((m, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-rose-500/50">•</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-surface-100">
                  <p className="text-[10px] text-gray-500">Story Flow</p>
                  <p className="text-xs text-gray-300">
                    {report.narrative.storyFlowRating}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-surface-100">
                  <p className="text-[10px] text-gray-500">Persuasiveness</p>
                  <p className="text-xs text-gray-300">
                    {report.narrative.persuasiveness}
                  </p>
                </div>
              </div>
            </div>
          </Collapsible>
        }
      />

      <DimensionCard
        type="problemSolution"
        data={{
          score: report.problemSolution.score,
          strengths: report.problemSolution.strengths,
          weaknesses: report.problemSolution.weaknesses,
          suggestions: report.problemSolution.suggestions,
        }}
        index={2}
        extra={
          <Collapsible title="Problem-Solution Details">
            <div className="space-y-3 pt-3">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Identified Problem
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {report.problemSolution.identifiedProblem}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Identified Solution
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {report.problemSolution.identifiedSolution}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-surface-100">
                  <p className="text-[10px] text-gray-500">Pain Severity</p>
                  <p className="text-xs text-gray-300">
                    {report.problemSolution.painSeverity}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-surface-100">
                  <p className="text-[10px] text-gray-500">Scalability</p>
                  <p className="text-xs text-gray-300">
                    {report.problemSolution.scalabilityPotential}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-rose-400 font-medium mb-1">
                  Key Risks
                </p>
                <ul className="space-y-1">
                  {report.problemSolution.risks.map((r, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-rose-500/50">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-venture-400 font-medium mb-1">
                  VC Perspective
                </p>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  &ldquo;{report.problemSolution.vcPerspective}&rdquo;
                </p>
              </div>
            </div>
          </Collapsible>
        }
      />
    </div>
  );
}

function InvestorQuestionsSection({
  questions,
}: {
  questions: InvestorReport["investorQuestions"];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            Questions Investors Will Ask
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Prepare for these difficult questions in your next meeting
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-venture-500/10 text-venture-400 border border-venture-500/20">
          {questions.length} questions
        </span>
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            question={q.question}
            context={q.context}
            difficulty={q.difficulty}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DeckOverview({ report }: { report: InvestorReport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-venture-400" />
            <h2 className="text-sm font-semibold">Deck Overview</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="text-gray-500">
              Total Slides:{" "}
              <span className="text-gray-200 font-medium">
                {report.deckOverview.totalSlides}
              </span>
            </span>
            <span className="text-gray-500">
              Sections Detected:{" "}
              <span className="text-gray-200 font-medium">
                {report.deckOverview.detectedCategories.length}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.deckOverview.detectedCategories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2.5 py-1 rounded-full bg-venture-500/10 text-venture-400 border border-venture-500/20"
              >
                {cat}
              </span>
            ))}
          </div>
          {report.deckOverview.missingCategories.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-rose-400 font-medium mb-2">
                Missing Sections
              </p>
              <div className="flex flex-wrap gap-2">
                {report.deckOverview.missingCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActionBar({ reportId }: { reportId: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Button>
      </Link>
      <div className="flex-1" />
      <Button variant="secondary" size="sm" className="gap-2">
        <Download className="w-3.5 h-3.5" />
        Export PDF
      </Button>
      <Button variant="secondary" size="sm" className="gap-2">
        <Share2 className="w-3.5 h-3.5" />
        Share
      </Button>
      <Link href="/dashboard">
        <Button size="sm" className="gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          New Analysis
        </Button>
      </Link>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<InvestorReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (id === "sample-demo") {
      setReport(SAMPLE_REPORT);
      setLoading(false);
      return;
    }
    try {
      const stored = sessionStorage.getItem(id);
      if (stored) {
        setReport(JSON.parse(stored));
      } else {
        setError(
          "Evaluation not found. It may have expired. Return to dashboard and analyze again.",
        );
      }
    } catch {
      setError("Could not load evaluation data.");
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-60 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-venture-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-60 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Evaluation Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">
              {error || "Could not load this evaluation."}
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-60 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={report.startupName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto p-8"
          >
            <ActionBar reportId={id} />

            <OverviewSection report={report} />
            <TopStrengthsRisks report={report} />
            <CriticalImprovement text={report.mostCriticalImprovement} />

            <div className="grid md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2">
                <RadarSection report={report} />
              </div>
              <div className="md:col-span-3">
                <DeckOverview report={report} />
              </div>
            </div>

            <DimensionSections report={report} />
            <InvestorQuestionsSection questions={report.investorQuestions} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-12 border-t border-border"
            ></motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
