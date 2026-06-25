"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  BarChart3,
  Sparkles,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { DECK_EXAMPLES } from "@/services/examples";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, Suspense, useEffect } from "react";

function UploadZone({ deckText, setDeckText, onAnalyze, disabled }: { deckText: string; setDeckText: (v: string) => void; onAnalyze: (text: string) => void; disabled: boolean }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragOver ? "border-venture-500 bg-venture-500/5" : "border-border hover:border-venture-500/30"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-venture-500/10 border border-venture-500/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-venture-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Drop your pitch deck here</p>
            <p className="text-xs text-gray-500 mt-1">Supports PDF, PPTX — or paste text below</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <p className="text-xs font-medium text-gray-500">Load example deck</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {DECK_EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => setDeckText(ex.content)}
              disabled={disabled}
              className="group relative px-3 py-2 rounded-lg border border-border bg-surface-50 hover:border-venture-500/30 hover:bg-venture-500/5 text-left transition-all disabled:opacity-50"
            >
              <p className="text-sm font-medium text-gray-300 group-hover:text-venture-400 transition-colors">{ex.name}</p>
              <p className="text-xs text-gray-600 mt-0.5">{ex.startup}</p>
            </button>
          ))}
        </div>

        <textarea
          placeholder="Paste your deck text here. Include slide titles like 'Slide 1: Problem' for best results..."
          value={deckText}
          onChange={(e) => setDeckText(e.target.value)}
          rows={6}
          disabled={disabled}
          className="w-full bg-surface-50 border border-border rounded-xl p-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-venture-500/40 resize-none transition-colors disabled:opacity-50"
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-600">
            {deckText.trim().length > 0 ? `${deckText.trim().split(/\s+/).length} words` : "Enter your deck content"}
          </p>
          <Button
            onClick={() => onAnalyze(deckText)}
            disabled={!deckText.trim() || disabled}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {disabled ? "Analyzing..." : "Analyze Deck"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardContent() {
  useSearchParams();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deckText, setDeckText] = useState("");

  const handleAnalyze = async (text: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed. Please try again.");
        setAnalyzing(false);
        return;
      }
      sessionStorage.setItem(data.id, JSON.stringify(data.report));
      router.push(`/results/${data.id}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight">New Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">Paste a pitch deck or load an example to get started</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-400">Error</p>
              <p className="text-xs text-gray-400 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-gray-500 hover:text-gray-300 ml-auto">
              &times;
            </button>
          </motion.div>
        )}

        {analyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-venture-400" />
            </motion.div>
            <p className="text-sm text-gray-400 mt-4">Analyzing your deck...</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-venture-500 animate-pulse" />
              <span className="text-xs text-gray-600">Evaluating communication, narrative, and problem-solution fit</span>
            </div>
          </motion.div>
        ) : (
          <UploadZone deckText={deckText} setDeckText={setDeckText} onAnalyze={handleAnalyze} disabled={analyzing} />
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-60">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Loading...
            </div>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
