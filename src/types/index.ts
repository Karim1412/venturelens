export type SlideCategory =
  | "Cover"
  | "Problem"
  | "Solution"
  | "Product"
  | "Market"
  | "Business Model"
  | "Traction"
  | "GTM"
  | "Team"
  | "Ask"
  | "Other";

export interface Slide {
  category: SlideCategory;
  content: string;
  confidence: number;
}

export interface DimensionScore {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface CommunicationScore extends DimensionScore {
  grammarIssues: string[];
  clarityIssues: string[];
}

export interface NarrativeScore extends DimensionScore {
  missingElements: string[];
  storyFlowRating: string;
  persuasiveness: string;
}

export interface ProblemSolutionScore extends DimensionScore {
  identifiedProblem: string;
  identifiedSolution: string;
  painSeverity: string;
  marketRelevance: string;
  scalabilityPotential: string;
  risks: string[];
  vcPerspective: string;
}

export interface InvestorQuestion {
  question: string;
  context: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
}

export type Verdict =
  | "Strong Investment Opportunity"
  | "Promising but Needs Improvement"
  | "High Risk / Weak Investment Case";

export interface InvestorReport {
  startupName: string;
  tagline: string;
  overallScore: number;
  verdict: Verdict;
  communication: CommunicationScore;
  narrative: NarrativeScore;
  problemSolution: ProblemSolutionScore;
  topStrengths: string[];
  topRisks: string[];
  mostCriticalImprovement: string;
  investorQuestions: InvestorQuestion[];
  radarData: { dimension: string; score: number }[];
  generatedAt: string;
  deckOverview: {
    totalSlides: number;
    detectedCategories: SlideCategory[];
    missingCategories: SlideCategory[];
  };
}

export interface EvaluationRequest {
  content: string;
  startupName?: string;
  tagline?: string;
}

export interface EvaluationResult {
  report: InvestorReport;
  id: string;
}
