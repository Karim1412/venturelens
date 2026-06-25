import { InvestorReport } from "@/types";

export const SAMPLE_REPORT: InvestorReport = {
  startupName: "SupportAI",
  tagline: "AI-Powered Customer Support Automation for Enterprise",
  overallScore: 72,
  verdict: "Promising but Needs Improvement",
  communication: {
    score: 78,
    strengths: [
      "Clean, modern slide design with consistent typography",
      "Concise value proposition on the opening slide",
      "Good use of data visualization in traction section",
      "Professional tone throughout the deck",
    ],
    weaknesses: [
      "Several slides contain dense paragraphs that hinder quick scanning",
      "Grammar inconsistency in the GTM section (missing articles)",
      "The Product slide uses technical jargon without explanation",
      "Bullet-point overload on the Market slide (12+ items)",
    ],
    suggestions: [
      "Reduce text density: max 30 words per slide for key messages",
      "Add a glossary slide for technical terms if they must be included",
      "Standardize verb tense across all slides",
      "Replace bullet-point lists with visual diagrams where possible",
    ],
    grammarIssues: [
      "Missing article in 'We built scalable solution' (slide 7)",
      "Run-on sentence in the Team section",
      "Inconsistent capitalization of product name",
    ],
    clarityIssues: [
      "Revenue model explanation is ambiguous",
      "Target market segmentation is unclear",
      "Competitive positioning could be sharper",
    ],
  },
  narrative: {
    score: 65,
    strengths: [
      "Strong opening hook with relatable customer pain point",
      "Clear problem-solution sequence in early slides",
      "Founder background lends credibility to the domain",
      "Effective use of customer testimonial in Traction section",
    ],
    weaknesses: [
      "The transition from Problem to Solution feels abrupt",
      "Market opportunity sizing lacks TAM/SAM/SOM breakdown",
      "Go-to-Market strategy is vague and lacks channel specificity",
      "The Ask slide does not specify use of funds allocation",
    ],
    missingElements: [
      "No competitive landscape analysis",
      "Missing revenue model details (unit economics)",
      "No clear defensibility or moat argument",
      "Lacks a timeline or roadmap slide",
      "No mention of key metrics or KPIs",
    ],
    suggestions: [
      "Add a dedicated Competitive Landscape slide with positioning map",
      "Include TAM/SAM/SOM analysis with clear sources",
      "Specify GTM channels with customer acquisition cost estimates",
      "Add a Roadmap slide showing 12-18 month milestones",
    ],
    storyFlowRating: "Above average but missing key narrative elements",
    persuasiveness: "Moderately persuasive - strong problem but weak solution differentiation",
  },
  problemSolution: {
    score: 74,
    strengths: [
      "Well-articulated problem with real-world examples",
      "Solution directly addresses the identified pain points",
      "Good understanding of enterprise customer needs",
      "Scalable architecture with clear technical differentiation",
    ],
    weaknesses: [
      "Problem severity could be quantified more concretely",
      "Solution does not fully address the frequency of the problem",
      "Market timing argument ('why now') is underdeveloped",
      "Risk of solution being too narrow for venture-scale returns",
    ],
    suggestions: [
      "Quantify problem cost: 'Enterprises lose $X annually due to...'",
      "Strengthen the 'Why Now' thesis with market trends",
      "Show how the solution can expand horizontally over time",
    ],
    identifiedProblem:
      "Enterprise customer support teams spend 70% of their time on repetitive, low-level tickets that don't require human empathy or complex judgment. This leads to high agent turnover, slow response times, and escalating operational costs. Existing solutions (rule-based chatbots) fail because they can't handle nuance, while human-only support doesn't scale.",
    identifiedSolution:
      "SupportAI is an AI-native customer support automation platform that uses fine-tuned LLMs to autonomously resolve 60%+ of Tier-1 support tickets. It integrates with existing helpdesk tools (Zendesk, Intercom, Salesforce) and learns from historical tickets to continuously improve resolution rates. For complex issues, it seamlessly escalates to human agents with full context.",
    painSeverity:
      "High - Customer support costs represent 15-25% of enterprise operating expenses. Current NPS for support is at an all-time low across industries.",
    marketRelevance:
      "Strong - The AI customer service market is projected to reach $40B+ by 2030, accelerated by labor cost inflation and AI maturity.",
    scalabilityPotential:
      "Moderate to High - Solution addresses a universal pain point across industries, but initial enterprise sales cycles are long (6-12 months).",
    risks: [
      "Competition from incumbents (Zendesk, Salesforce) adding AI features",
      "LLM accuracy and hallucination risks in customer-facing contexts",
      "Enterprise sales cycle may slow growth trajectory",
      "Dependence on OpenAI/Anthropic API pricing and availability",
    ],
    vcPerspective:
      "The problem is real and the market is large, which is attractive. However, the competitive landscape is heating up quickly, and the lack of clear defensibility beyond 'better AI fine-tuning' is concerning. The team needs to demonstrate stronger moat through proprietary data, workflow integrations, or network effects. At current stage, this is an interesting seed-stage opportunity but needs more proof points for Series A.",
  },
  topStrengths: [
    "Clear, painful problem with strong market validation",
    "Experienced founding team with domain expertise",
    "Impressive early traction with 3 enterprise design partners",
  ],
  topRisks: [
    "Increasing competition from incumbents adding AI features",
    "Long enterprise sales cycle may impact growth velocity",
    "No clear defensibility beyond initial AI model advantage",
  ],
  mostCriticalImprovement:
    "Add a clear defensibility strategy showing how the company will build a moat through proprietary data, workflow locks, or network effects over time.",
  investorQuestions: [
    {
      question: "What happens when Zendesk or Salesforce ships native AI support automation? How is your solution defensible?",
      context:
        "Incumbent platforms already have distribution, existing relationships, and data. A feature-level response is insufficient.",
      difficulty: "Advanced",
    },
    {
      question: "Your resolution rate is 60% for Tier-1 tickets. What's the ceiling, and what technical breakthroughs are needed to get there?",
      context:
        "Investors want to understand the technical roadmap and whether the team has a realistic path to 80-90% automation.",
      difficulty: "Advanced",
    },
    {
      question: "Why now? What has changed in the last 18 months that makes this the right time to build SupportAI?",
      context:
        "Investors look for market timing alignment. LLM advancements alone may not be sufficient justification.",
      difficulty: "Intermediate",
    },
    {
      question: "Your initial target is mid-market enterprises. What's the CAC-to-LTV ratio you're projecting, and how does it compare to traditional support software?",
      context:
        "Unit economics are critical for SaaS investors. Vague answers suggest lack of financial modeling rigor.",
      difficulty: "Intermediate",
    },
    {
      question: "What proprietary data or unique training methodology do you have that competitors can't replicate within 6 months?",
      context:
        "In AI startups, the data moat is often the only defensible advantage. Generic fine-tuning is not a moat.",
      difficulty: "Basic",
    },
  ],
  radarData: [
    { dimension: "Communication & Clarity", score: 78 },
    { dimension: "Narrative & Storytelling", score: 65 },
    { dimension: "Problem-Solution Fit", score: 74 },
    { dimension: "Market Opportunity", score: 70 },
    { dimension: "Team & Execution", score: 68 },
    { dimension: "Investor Appeal", score: 72 },
  ],
  generatedAt: new Date().toISOString(),
  deckOverview: {
    totalSlides: 12,
    detectedCategories: [
      "Cover",
      "Problem",
      "Solution",
      "Product",
      "Market",
      "Business Model",
      "Traction",
      "GTM",
      "Team",
      "Ask",
    ],
    missingCategories: [],
  },
};
