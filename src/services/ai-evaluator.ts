import Groq from "groq-sdk";
import { EvaluationRequest, EvaluationResult, InvestorReport, SlideCategory } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a venture capital analyst evaluating early-stage pitch decks. Your output must be valid JSON only — no markdown, no code fences, no commentary.

Evaluate the deck across these 3 weighted dimensions:
1. Communication & Clarity (25%) — readability, jargon, conciseness, data density
2. Narrative & Storytelling (35%) — slide completeness, logical flow, persuasiveness
3. Problem-Solution Fit (40%) — pain severity, defensibility, market timing, competition

Rules:
- Scores must be integers 0–100
- verdict must be exactly one of: "Strong Investment Opportunity" | "Promising but Needs Improvement" | "High Risk / Weak Investment Case"
- detectedCategories and missingCategories are subsets of: Cover, Problem, Solution, Product, Market, Business Model, Traction, GTM, Team, Ask  
- radarData dimensions exactly: Communication & Clarity, Narrative & Storytelling, Problem-Solution Fit, Market Opportunity, Team & Execution, Investor Appeal
- Write from the perspective of a seasoned VC partner at a top-tier firm
- Be specific — reference actual content from the deck in your analysis
- Generate 5 tough investor questions with difficulty: "Basic" | "Intermediate" | "Advanced"

Return valid JSON matching this TypeScript type exactly:

{
  "startupName": "string",
  "tagline": "string",
  "overallScore": "number 0-100",
  "verdict": "one of the three verdict strings",
  "communication": {
    "score": "number",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "suggestions": ["string"],
    "grammarIssues": ["string"],
    "clarityIssues": ["string"]
  },
  "narrative": {
    "score": "number",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "suggestions": ["string"],
    "missingElements": ["string"],
    "storyFlowRating": "string",
    "persuasiveness": "string"
  },
  "problemSolution": {
    "score": "number",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "suggestions": ["string"],
    "identifiedProblem": "string",
    "identifiedSolution": "string",
    "painSeverity": "string",
    "marketRelevance": "string",
    "scalabilityPotential": "string",
    "risks": ["string"],
    "vcPerspective": "string"
  },
  "topStrengths": ["string"],
  "topRisks": ["string"],
  "mostCriticalImprovement": "string",
  "investorQuestions": [
    { "question": "string", "context": "string", "difficulty": "Basic|Intermediate|Advanced" }
  ],
  "radarData": [
    { "dimension": "string", "score": "number" }
  ],
  "deckOverview": {
    "totalSlides": "number",
    "detectedCategories": ["string"],
    "missingCategories": ["string"]
  }
}`;

export async function evaluateDeckAI(request: EvaluationRequest): Promise<EvaluationResult> {
  const { content, startupName, tagline } = request;

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured. Set the environment variable or use the heuristic evaluator.");
  }

  const userPrompt = `Evaluate this pitch deck and return valid JSON:

Startup Name: ${startupName || "Extract from content"}
Tagline: ${tagline || "Extract from content"}

Deck Content:
${content}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Groq returned an empty response");

  const report = JSON.parse(raw) as InvestorReport;

  report.generatedAt = new Date().toISOString();

  if (!report.radarData || report.radarData.length === 0) {
    report.radarData = [
      { dimension: "Communication & Clarity", score: report.communication?.score || 50 },
      { dimension: "Narrative & Storytelling", score: report.narrative?.score || 50 },
      { dimension: "Problem-Solution Fit", score: report.problemSolution?.score || 50 },
      { dimension: "Market Opportunity", score: Math.min(98, (report.problemSolution?.score || 50) + 5) },
      { dimension: "Team & Execution", score: Math.min(98, (report.narrative?.score || 50) + 3) },
      { dimension: "Investor Appeal", score: Math.min(98, (report.overallScore || 50) + 8) },
    ];
  }

  if (!report.deckOverview) {
    report.deckOverview = { totalSlides: 0, detectedCategories: [], missingCategories: [] };
  }

  return {
    report,
    id: `eval-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}
