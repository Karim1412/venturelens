import {
  EvaluationRequest,
  EvaluationResult,
  InvestorReport,
  Slide,
  SlideCategory,
  InvestorQuestion,
} from "@/types";

const ALL_CATEGORIES: SlideCategory[] = [
  "Cover", "Problem", "Solution", "Product", "Market",
  "Business Model", "Traction", "GTM", "Team", "Ask",
];

const SLIDE_PATTERNS: [RegExp, SlideCategory, number][] = [
  [/^\s*(cover|title|intro|home)\b/im, "Cover", 0.92],
  [/\b(problem|pain point|pain|challenge|frustration|struggle|hard to|difficult|broken|waste|inefficien)\b/i, "Problem", 0.9],
  [/\b(solution|approach|how it works|platform overview|our product|we solve|we built|the platform)\b/i, "Solution", 0.9],
  [/\b(product|features|demo|dashboard|screenshot|integration|how it looks|user interface|workflow)\b/i, "Product", 0.85],
  [/\b(market|opportunity|tam|sam|som|industry|market size|addressable|segment|total addressable)\b/i, "Market", 0.92],
  [/\b(business model|revenue|pricing|monetization|unit economic|subscription|saas|margin|gross margin|ltv|cac)\b/i, "Business Model", 0.92],
  [/\b(traction|growth|milestone|users|customers|revenue|mr|arr|retention|engagement|kpi|waitlist|beta|pilot)\b/i, "Traction", 0.9],
  [/\b(go.to.market|gtm|strategy|channel|distribution|sales|marketing|partnership|acquisition|viral)\b/i, "GTM", 0.92],
  [/\b(team|founder|about us|leadership|advisors|background|ceo|cto|founded by|co-founder)\b/i, "Team", 0.94],
  [/\b(ask|raise|funding|investment|round|use of funds|we.are raising|seeking|closing|invest)\b/i, "Ask", 0.94],
];

function detectSlideCategories(content: string): Slide[] {
  const blocks = content.split(/\n(?=Slide|#|---|##)/i).filter((b) => b.trim().length > 10);
  if (blocks.length === 0) {
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    const chunkSize = Math.max(3, Math.ceil(lines.length / 8));
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize).join("\n");
      let category: SlideCategory = "Other";
      let confidence = 0.3;
      for (const [regex, cat, conf] of SLIDE_PATTERNS) {
        if (regex.test(chunk)) { category = cat; confidence = conf; break; }
      }
      blocks.push(chunk);
    }
  }

  const slides: Slide[] = [];
  for (const block of blocks) {
    const lower = block.toLowerCase();
    let category: SlideCategory = "Other";
    let confidence = 0.35;
    let matchedPattern = "";
    for (const [regex, cat, conf] of SLIDE_PATTERNS) {
      if (regex.test(lower)) { category = cat; confidence = conf + 0.05; matchedPattern = regex.source; break; }
    }
    slides.push({ category, content: block.trim(), confidence: Math.min(confidence, 1) });
  }
  return slides;
}

function extractCategories(slides: Slide[]) {
  const detected = [...new Set(slides.map((s) => s.category))];
  return {
    detected: detected.filter((c) => c !== "Other") as SlideCategory[],
    missing: ALL_CATEGORIES.filter((c) => !detected.includes(c)),
  };
}

function fleschReadingEase(text: string): { score: number; label: string } {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const syllables = words.reduce((sum, w) => {
    const s = w.toLowerCase().replace(/[^a-z]/g, "");
    if (s.length <= 3) return sum + 1;
    const matches = s.match(/[aeiouy]{1,2}/g);
    return sum + (matches ? matches.length : 1);
  }, 0);
  if (words.length === 0 || sentences.length === 0) return { score: 50, label: "Average" };
  const score = Math.max(0, Math.min(100, 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length)));
  let label: string;
  if (score >= 70) label = "Very Easy";
  else if (score >= 60) label = "Easy";
  else if (score >= 50) label = "Fairly Easy";
  else if (score >= 40) label = "Average";
  else if (score >= 30) label = "Fairly Difficult";
  else if (score >= 20) label = "Difficult";
  else label = "Very Difficult";
  return { score: Math.round(score), label };
}

function analyzeCommunication(slides: Slide[]): InvestorReport["communication"] {
  const allText = slides.map((s) => s.content).join("\n");
  const words = allText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const avgWordsPerSlide = wordCount / Math.max(slides.length, 1);
  const sentences = allText.match(/[^.!?]+[.!?]+/g) || [];
  const avgSentenceLen = sentences.length > 0
    ? sentences.reduce((sum, s) => sum + s.split(/\s+/).filter(Boolean).length, 0) / sentences.length
    : 0;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  const grammarIssues: string[] = [];
  const clarityIssues: string[] = [];
  let deductions = 0;

  if (avgWordsPerSlide < 25 && slides.length > 3) {
    strengths.push("Exceptionally concise — slides are scannable and investor-friendly");
    deductions -= 2;
  } else if (avgWordsPerSlide > 75) {
    weaknesses.push(`High word density (avg ${Math.round(avgWordsPerSlide)} words/slide) — investors scan, they don't read`);
    suggestions.push("Reduce to 30–50 words per slide; move details to an appendix");
    grammarIssues.push("Text density exceeds investor readability threshold");
    deductions += 8;
  } else if (avgWordsPerSlide > 50) {
    weaknesses.push(`Slides average ${Math.round(avgWordsPerSlide)} words — could be tighter`);
    suggestions.push("Aim for under 50 words per slide for maximum impact");
    deductions += 3;
  } else {
    strengths.push("Good slide density — balanced between detail and scannability");
  }

  if (avgSentenceLen > 22) {
    weaknesses.push(`Average sentence length of ${Math.round(avgSentenceLen)} words is above the recommended 15–20`);
    suggestions.push("Break long sentences into shorter, punchier statements");
    clarityIssues.push("Several sentences exceed readable length for investor decks");
    deductions += 5;
  } else if (avgSentenceLen > 0 && avgSentenceLen < 15) {
    strengths.push("Short, punchy sentences improve readability and impact");
  }

  const jargonList = [
    "synergy", "disrupt", "leverage", "paradigm", "cutting-edge",
    "next-gen", "revolutionary", "game-changing", "best-in-class",
    "innovative", "world-class", "industry-leading", "state-of-the-art",
    "bleeding-edge", "thought leader", "holistic", "robust",
  ];
  const foundJargon = jargonList.filter((w) => allText.toLowerCase().includes(w));
  if (foundJargon.length >= 2) {
    weaknesses.push(`Overused buzzwords weaken credibility: "${foundJargon.slice(0, 4).join(", ")}"`);
    suggestions.push("Replace vague buzzwords with specific, verifiable claims and metrics");
    grammarIssues.push(`Buzzword fatigue: ${foundJargon.length} instances detected`);
    deductions += 5 + foundJargon.length * 2;
  } else if (foundJargon.length === 1) {
    weaknesses.push(`Minor buzzword usage ("${foundJargon[0]}") — prefer concrete language`);
    deductions += 2;
  } else {
    strengths.push("Clear, jargon-free language — investors appreciate directness");
  }

  const passiveMatches = allText.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/gi);
  if (passiveMatches && passiveMatches.length > 5) {
    weaknesses.push(`Heavy passive voice (${passiveMatches.length} instances) reduces directness`);
    suggestions.push("Use active voice to sound more confident and decisive");
    clarityIssues.push("Excessive passive voice weakens message impact");
    deductions += 4;
  } else if (passiveMatches && passiveMatches.length > 2) {
    weaknesses.push(`Some passive voice detected (${passiveMatches.length} instances)`);
    suggestions.push("Convert passive constructions to active voice where possible");
    deductions += 1;
  }

  const paragraphs = allText.split(/\n\s*\n/);
  const denseParagraphs = paragraphs.filter((p) => p.split(/\s+/).length > 80);
  if (denseParagraphs.length > 1) {
    weaknesses.push(`${denseParagraphs.length} overly dense paragraphs — investors scan, not read`);
    suggestions.push("Replace paragraphs with bullet points, visuals, or data callouts");
    deductions += 4;
  }

  const readingEase = fleschReadingEase(allText);
  if (readingEase.score < 30 && readingEase.score > 0) {
    weaknesses.push(`Flesch Reading Ease: ${readingEase.score}/100 (${readingEase.label}) — deck is too dense`);
    suggestions.push("Use shorter words and sentences to improve readability for time-constrained investors");
    clarityIssues.push(`Low readability score: ${readingEase.score}/100`);
    deductions += 4;
  } else if (readingEase.score >= 50 && readingEase.score <= 100) {
    strengths.push(`Good readability (Flesch: ${readingEase.score}/100 — ${readingEase.label})`);
  }

  const bulletPoints = (allText.match(/^[\s]*[-•*]\s/gm) || []).length;
  if (bulletPoints > 10) {
    strengths.push(`Effective use of ${bulletPoints} bullet points — scannable formatting`);
    deductions -= 2;
  } else if (bulletPoints > 0 && bulletPoints <= 3) {
    weaknesses.push("Limited use of bullet points — investors scan, not read");
    suggestions.push("Convert key points into scannable bullet lists");
    deductions += 2;
  }

  const numberMatches = allText.match(/\b\d+[.\d]*(%|x|X|\s*(M|B|T|million|billion|trillion|thousand|k|users|customers|revenue|dollars|usd|eur))?\b/g) || [];
  const dataPoints = numberMatches.filter((n) => parseInt(n) > 0 || n.includes("%")).length;
  if (dataPoints > 8) {
    strengths.push(`Strong data density — ${dataPoints} quantified data points strengthen credibility`);
    deductions -= 3;
  } else if (dataPoints < 3 && slides.length > 3) {
    weaknesses.push("Very few quantified data points — investors want numbers, not adjectives");
    suggestions.push("Add specific metrics: growth rates, revenue figures, market sizes, customer counts");
    deductions += 4;
  }

  const capsWords = words.filter((w) => w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (capsWords.length > wordCount * 0.1) {
    grammarIssues.push("Inconsistent capitalization — excessive use of ALL CAPS");
    deductions += 2;
  }

  const numberStarters = sentences.filter((s) => /^\s*\d+/.test(s)).length;
  if (numberStarters > sentences.length * 0.3 && sentences.length > 3) {
    grammarIssues.push("Excessive sentences starting with numbers — disrupts narrative flow");
    deductions += 1;
  }

  let baseScore = 82;
  const rawScore = Math.max(20, Math.min(98, baseScore - deductions));

  return {
    score: rawScore,
    strengths: strengths.length > 0 ? strengths : ["Communication is functional but needs refinement"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["No major communication issues detected"],
    suggestions: suggestions.length > 0 ? suggestions : ["Continue refining slide-level messaging for maximum clarity"],
    grammarIssues: grammarIssues.length > 0 ? grammarIssues : ["No significant grammar issues found"],
    clarityIssues: clarityIssues.length > 0 ? clarityIssues : ["Overall clarity is acceptable"],
  };
}

function analyzeNarrative(slides: Slide[]): InvestorReport["narrative"] {
  const { detected, missing } = extractCategories(slides);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingElements: string[] = [];
  const suggestions: string[] = [];
  let deductions = 0;

  const hasHook = detected.includes("Cover");
  const hasProblem = detected.includes("Problem");
  const hasSolution = detected.includes("Solution");
  const hasMarket = detected.includes("Market");
  const hasAsk = detected.includes("Ask");
  const hasTeam = detected.includes("Team");

  if (hasProblem && hasSolution) {
    strengths.push("Strong problem-solution narrative arc establishes clear value proposition");
    deductions -= 3;
  } else if (!hasProblem && !hasSolution) {
    weaknesses.push("Missing both Problem and Solution slides — core narrative gap");
    missingElements.push("Problem slide");
    missingElements.push("Solution slide");
    suggestions.push("Add dedicated Problem and Solution slides early in the deck");
    deductions += 12;
  } else if (!hasProblem) {
    weaknesses.push("Missing Problem slide — investors need to understand the pain first");
    missingElements.push("Problem slide");
    deductions += 6;
  } else if (!hasSolution) {
    weaknesses.push("Missing Solution slide — how do you solve this?");
    missingElements.push("Solution slide");
    deductions += 6;
  }

  if (hasMarket) {
    const marketSlide = slides.find((s) => s.category === "Market");
    const marketText = marketSlide?.content || "";
    if (/tam|sam|som|\d+[.\d]*\s*(B|M|T|billion|million|trillion)/i.test(marketText)) {
      strengths.push("Market sizing includes quantified TAM/SAM/SOM — strengthens venture thesis");
      deductions -= 3;
    } else {
      strengths.push("Market opportunity is addressed; adding specific TAM/SAM/SOM figures would further strengthen");
      weaknesses.push("Market section lacks specific sizing numbers — include TAM/SAM/SOM");
      suggestions.push("Add $ figures with cited sources for TAM, SAM, and SOM");
      deductions += 3;
    }
  } else {
    weaknesses.push("No market analysis — investors cannot evaluate opportunity size");
    missingElements.push("Market sizing & opportunity analysis");
    suggestions.push("Include TAM/SAM/SOM with clear sources and growth trajectory");
    deductions += 10;
  }

  if (hasTeam) {
    const teamSlide = slides.find((s) => s.category === "Team");
    const teamText = teamSlide?.content || "";
    const hasRelevantBackground = /(former|previously|founded|ex-|years of|decade|phd|ms|bs|bachelor|master|doctorate)/i.test(teamText);
    if (hasRelevantBackground) {
      strengths.push("Team section demonstrates relevant domain expertise and credibility");
      deductions -= 2;
    } else {
      weaknesses.push("Team section lacks specific background context — highlight relevant experience");
      suggestions.push("Include previous companies, years of domain experience, and key achievements");
      deductions += 3;
    }
  } else {
    weaknesses.push("Missing Team slide — a critical gap for early-stage evaluation");
    missingElements.push("Team & founding background");
    deductions += 8;
  }

  if (hasAsk) {
    const askSlide = slides.find((s) => s.category === "Ask");
    const askText = askSlide?.content || "";
    if (/\$\s*\d+[.\d]*(k|m|b|million|billion|thousand)?/i.test(askText)) {
      strengths.push("Funding ask specifies amount — gives clarity on round size");
      if (/use of funds|allocation|spend on|hiring|engineer|sales|market|product/i.test(askText)) {
        strengths.push("Use of funds breakdown shows thoughtful capital allocation planning");
        deductions -= 3;
      } else {
        weaknesses.push("Ask mentions amount but lacks use of funds breakdown");
        suggestions.push("Detail how capital will be allocated (engineering, sales, marketing, operations)");
        deductions += 2;
      }
    } else {
      weaknesses.push("Ask lacks specific funding amount — be clear about what you're raising");
      suggestions.push("Specify exact amount, use of funds, and milestones this round enables");
      deductions += 5;
    }
  } else {
    weaknesses.push("No Ask slide — investors need to know what you're raising and why");
    missingElements.push("Funding ask & use of funds");
    suggestions.push("Specify amount, use of funds, and milestones this round enables");
    deductions += 6;
  }

  const hasTraction = detected.includes("Traction");
  if (hasTraction) {
    const tractionSlide = slides.find((s) => s.category === "Traction");
    const tractionText = tractionSlide?.content || "";
    if (/\d+[.\d]*\s*(k|m|b|thousand|million|billion|%|users|customers|revenue|arr|mr)/i.test(tractionText)) {
      strengths.push("Traction data is quantified with specific metrics — reduces perceived risk");
      deductions -= 4;
    } else {
      weaknesses.push("Traction section mentions growth but lacks specific metrics");
      suggestions.push("Include exact user counts, revenue figures, growth rates, and retention data");
      deductions += 1;
    }
  } else {
    weaknesses.push("No traction data — early-stage investors expect at least qualitative validation");
    missingElements.push("Traction or validation evidence");
    suggestions.push("Include any user feedback, pilot results, or growth metrics");
    deductions += 4;
  }

  if (detected.includes("Business Model")) {
    const bmSlide = slides.find((s) => s.category === "Business Model");
    const bmText = bmSlide?.content || "";
    if (/cac|ltv|gross margin|unit economic|subscription|pricing/i.test(bmText)) {
      strengths.push("Detailed business model with unit economics — shows financial rigor");
      deductions -= 3;
    } else {
      strengths.push("Business model is addressed; adding unit economics would strengthen further");
      weaknesses.push("Business model needs unit economics: CAC, LTV, gross margin");
      suggestions.push("Add key unit economics: customer acquisition cost, lifetime value, gross margins");
      deductions += 2;
    }
  } else {
    weaknesses.push("Revenue model is unclear — a key concern for investment evaluation");
    missingElements.push("Business model & unit economics");
    suggestions.push("Explain revenue streams, pricing, and key unit economics");
    deductions += 5;
  }

  if (detected.includes("GTM")) {
    const gtmSlide = slides.find((s) => s.category === "GTM");
    const gtmText = gtmSlide?.content || "";
    if (/channel|partnership|sales|cac|viral|referral|content|seo|direct/i.test(gtmText)) {
      strengths.push("Go-to-market strategy defines specific channels and distribution approach");
      deductions -= 2;
    } else {
      weaknesses.push("GTM strategy is vague — needs specific channel identification");
      suggestions.push("Identify primary acquisition channels with estimated CAC per channel");
      deductions += 2;
    }
  } else {
    weaknesses.push("No GTM strategy — how will you acquire customers?");
    missingElements.push("Go-to-market strategy");
    suggestions.push("Define channels, CAC estimates, and distribution partnerships");
    deductions += 4;
  }

  const completeness = detected.length / ALL_CATEGORIES.length;
  if (completeness > 0.7) {
    strengths.push(`Strong narrative completeness — ${detected.length}/${ALL_CATEGORIES.length} key sections present`);
  } else {
    weaknesses.push(`Incomplete narrative — only ${detected.length}/${ALL_CATEGORIES.length} key sections detected`);
    suggestions.push(`Add missing sections: ${missing.filter((m) => m !== "Other").join(", ")}`);
  }

  const problemIdx = detected.indexOf("Problem");
  const solutionIdx = detected.indexOf("Solution");
  if (problemIdx >= 0 && solutionIdx >= 0 && problemIdx > solutionIdx) {
    weaknesses.push("Problem appears after Solution — this breaks the narrative logic");
    suggestions.push("Reorder slides: Problem should precede Solution");
    deductions += 4;
  }

  const marketIdx = detected.indexOf("Market");
  if (marketIdx >= 0 && (problemIdx < 0 || marketIdx < problemIdx)) {
    if (marketIdx < problemIdx && problemIdx >= 0) {
      weaknesses.push("Market slide appears before Problem — narrative should establish pain before sizing opportunity");
      suggestions.push("Move Problem before Market for logical flow");
      deductions += 2;
    }
  }

  if (hasHook) {
    const coverSlide = slides.find((s) => s.category === "Cover");
    const coverText = coverSlide?.content || "";
    if (coverText.split("\n").filter(Boolean).length >= 3) {
      strengths.push("Cover slide includes multiple elements (name, tagline, positioning)");
    } else {
      weaknesses.push("Cover slide is sparse — include tagline and positioning along with startup name");
      deductions += 1;
    }
  } else {
    weaknesses.push("No dedicated Cover slide — first impression matters");
    suggestions.push("Add a Cover slide with startup name, tagline, and a compelling value proposition");
    deductions += 2;
  }

  let rawScore = Math.max(20, Math.min(98, 72 - deductions));
  let persuasiveness: string;
  if (rawScore >= 80) persuasiveness = "Strong — compelling narrative with clear investor appeal and logical flow";
  else if (rawScore >= 65) persuasiveness = "Good — decent story structure but needs sharper positioning and data backing";
  else if (rawScore >= 50) persuasiveness = "Moderate — narrative exists but critical gaps reduce persuasiveness";
  else persuasiveness = "Weak — narrative gaps undermine investor confidence and clarity";

  return {
    score: rawScore,
    strengths: strengths.length > 0 ? strengths : ["Basic narrative structure is present"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Narrative could be more compelling"],
    missingElements: missingElements.length > 0 ? missingElements : ["All key narrative sections present"],
    suggestions: suggestions.length > 0 ? suggestions : ["Strengthen the emotional arc and founder vision"],
    storyFlowRating: rawScore >= 75 ? "Well-structured narrative flow with logical slide progression" : rawScore >= 55 ? "Adequate flow with gaps in logical progression" : "Disjointed narrative needs restructuring",
    persuasiveness,
  };
}

function analyzeProblemSolution(slides: Slide[]): InvestorReport["problemSolution"] {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  const risks: string[] = [];
  let deductions = 0;

  const problemSlide = slides.find((s) => s.category === "Problem");
  const solutionSlide = slides.find((s) => s.category === "Solution");
  const marketSlide = slides.find((s) => s.category === "Market");
  const tractionSlide = slides.find((s) => s.category === "Traction");

  const identifiedProblem = problemSlide?.content.slice(0, 400).trim()
    || "No clearly defined problem statement. This is a critical gap — investors need to understand what pain point you're addressing.";
  const identifiedSolution = solutionSlide?.content.slice(0, 400).trim()
    || "No clearly defined solution. Investors cannot evaluate what you've built without a dedicated solution description.";

  const problemText = (problemSlide?.content || "").toLowerCase();
  const solutionText = (solutionSlide?.content || "").toLowerCase();
  const marketText = (marketSlide?.content || "").toLowerCase();
  const allLower = slides.map((s) => s.content.toLowerCase()).join(" ");

  const painIndicators = [
    "pain", "cost", "inefficient", "slow", "expensive", "broken",
    "frustrat", "waste", "lose", "churn", "burnout", "turnover",
    "manual", "repetitive", "error", "delay", "bottleneck",
  ];
  const painHits = painIndicators.filter((w) => problemText.includes(w)).length;
  if (painHits >= 4) {
    strengths.push("Problem severity is well-articulated with multiple specific pain indicators");
    if (/\$\s*\d+[.\d]*(k|m|b|million|billion|thousand)?/i.test(problemText)) {
      strengths.push("Problem includes quantified financial impact — strengthens urgency");
      deductions -= 5;
    } else {
      strengths.push("Adding quantified financial impact of the problem would further strengthen");
      weaknesses.push("Quantify the problem's financial impact — how much do companies lose?");
      suggestions.push("Add specific dollar amounts: 'Companies lose $X/year due to this problem'");
      deductions -= 2;
    }
  } else if (painHits >= 2) {
    strengths.push("Problem is identified but severity could be quantified more concretely");
    weaknesses.push("Problem lacks quantified pain points — use data to establish severity");
    suggestions.push("Use specific data: how much time/money is lost, how many people are affected?");
    deductions += 2;
  } else {
    weaknesses.push("Problem severity is not clearly established — investors need to feel the pain");
    suggestions.push("Use specific data: industry statistics, customer research, or financial impact analysis");
    deductions += 5;
  }

  const hasMarketSize = /\b(\d+[.\d]*\s*(B|M|T|billion|million|trillion))\b/.test(marketText);
  if (hasMarketSize) {
    strengths.push("Market size is quantified — essential for venture-scale assessment");
    if (/\b(growth|growing|cagr|compound|expand|accelerat|%)\b/i.test(marketText)) {
      strengths.push("Market growth trajectory included — shows expanding opportunity window");
      deductions -= 4;
    } else {
      weaknesses.push("Market growth rate missing — static size alone doesn't tell the full story");
      suggestions.push("Include CAGR and growth trends to demonstrate expanding opportunity");
      deductions += 1;
    }
  } else if (marketSlide) {
    weaknesses.push("Market opportunity mentioned but not quantified with specific numbers");
    suggestions.push("Include TAM/SAM/SOM with cited sources");
    deductions += 4;
  }

  const solutionDetails = ["integrat", "api", "platform", "automated", "ai", "ml", "software", "dashboard", "workflow", "app", "mobile", "web", "cloud"];
  const detailHits = solutionDetails.filter((w) => solutionText.includes(w)).length;
  if (detailHits >= 4) {
    strengths.push("Solution description includes specific technical and product details");
    if (/patent|proprietary|unique|differentiat|novel/i.test(solutionText)) {
      strengths.push("Solution highlights specific differentiation and unique approach");
      deductions -= 4;
    } else {
      weaknesses.push("Solution lacks clear differentiation — why is your approach better?");
      deductions += 1;
    }
  } else if (detailHits >= 2) {
    strengths.push("Solution description is present but needs more technical specificity");
    weaknesses.push("Solution description is too high-level — add product specifics");
    suggestions.push("Add details about architecture, integrations, and key differentiators");
    deductions += 3;
  } else {
    weaknesses.push("Solution description lacks technical and product detail");
    suggestions.push("Describe the product architecture, key features, and what makes it unique");
    deductions += 5;
  }

  const moatWords = [
    "patent", "proprietary", "data moat", "network effect", "unique data",
    "exclusive", "advantage", "moat", "difficult to replicate", "barrier",
    "ip", "trade secret", "r&d", "research",
  ];
  const hasMoat = moatWords.some((w) => allLower.includes(w));
  if (!hasMoat) {
    weaknesses.push("No defensibility argument — how will you sustain your competitive advantage?");
    suggestions.push("Add a dedicated slide on competitive moat: data, network effects, IP, or deep integrations");
    risks.push("Lack of defensibility makes the business vulnerable to competition and commoditization");
    deductions += 5;
  } else {
    strengths.push("Defensibility argument present — investors value sustainable competitive advantage");
    if (/network effect|data moat|proprietary/i.test(allLower)) {
      strengths.push("Moat strategy includes defensible elements (network effects or proprietary assets)");
      deductions -= 3;
    }
  }

  const compWords = ["competit", "competitor", "alternative", "landscape", "vs ", "compared to", "differentiation", "market map", "positioning"];
  const hasCompetition = compWords.some((w) => allLower.includes(w));
  if (!hasCompetition) {
    weaknesses.push("No competitive analysis — investors will scrutinize the competitive landscape");
    suggestions.push("Add a competitive positioning map showing your differentiation against each key player");
    risks.push("Competitive response from incumbents could erode market position and pricing power");
    deductions += 4;
  } else {
    strengths.push("Competitive awareness demonstrated — investors appreciate market understanding");
    if (/\b(advantage|better|faster|cheaper|only|first|leader)\b/i.test(allLower)) {
      strengths.push("Clear competitive positioning with articulated advantages over alternatives");
      deductions -= 2;
    }
  }

  const timingWords = ["why now", "timing", "trend", "accelerat", "shift", "momentum", "inflection", "tailwind", "catalyst"];
  const hasTiming = timingWords.some((w) => allLower.includes(w));
  if (!hasTiming) {
    weaknesses.push("Missing 'Why Now' thesis — why is this the right time to build this?");
    suggestions.push("Explain market trends, technology shifts, or regulatory changes that create this opportunity");
    deductions += 3;
  } else {
    strengths.push("'Why Now' thesis included — crucial for convincing investors of market timing");
    if (/\b(regulation|technology shift|behavior change|covid|post.covid|remote|digital transform)\b/i.test(allLower)) {
      strengths.push("Timing argument references specific macro trends — adds credibility");
      deductions -= 2;
    }
  }

  if (tractionSlide) {
    const tractionText = tractionSlide.content.toLowerCase();
    if (/\d+[.\d]*\s*(k|m|b|thousand|million|billion)?\s*(users|customers|revenue|arr|mr)/i.test(tractionText)) {
      strengths.push("Quantified traction provides strong evidence of product-market fit");
      deductions -= 4;
    } else {
      strengths.push("Traction section present; adding specific growth metrics would strengthen further");
      weaknesses.push("Traction claims lack supporting numbers — validate with data");
      deductions += 1;
    }
  } else {
    risks.push("No demonstrated traction — early revenue or user validation would strengthen investment case");
  }

  risks.push("Scalability depends on maintaining product-market fit as market and competitive dynamics evolve");

  let rawScore = Math.max(20, Math.min(98, 74 - deductions));

  let painSeverity: string;
  if (rawScore >= 78) painSeverity = "High — problem is well-defined, painful for target users, and urgent to solve";
  else if (rawScore >= 62) painSeverity = "Moderate to High — problem is real but severity needs stronger quantification";
  else if (rawScore >= 45) painSeverity = "Moderate — problem exists but is not compellingly framed as a must-solve";
  else painSeverity = "Low — problem statement needs significant strengthening to establish urgency";

  let scalabilityPotential: string;
  if (rawScore >= 72) scalabilityPotential = "High — addresses a universal need with horizontal expansion potential across segments and geographies";
  else if (rawScore >= 55) scalabilityPotential = "Moderate — solution scope appears adequate but market timing and positioning need refinement";
  else scalabilityPotential = "Limited — current framing suggests narrow market potential; consider expanding the addressable use case";

  let vcPerspective: string;
  if (rawScore >= 80) {
    vcPerspective = "This is a compelling investment opportunity. The team has identified a genuine, high-severity problem and built a solution with clear differentiation. The market is large and growing, and the timing argument is well-supported by macro trends. Key diligence items will focus on unit economics, competitive positioning depth, and the team's ability to execute against the roadmap. Recommended for partner meeting.";
  } else if (rawScore >= 68) {
    vcPerspective = "The problem is real and the market opportunity is credible, which makes this worth a closer look. However, the solution needs stronger differentiation, and defensibility is a concern. We would like to see more traction data, clearer unit economics, and a more detailed go-to-market plan before moving forward. At the right valuation, this could be an interesting seed-stage investment if the identified gaps are addressed.";
  } else if (rawScore >= 50) {
    vcPerspective = "The core idea has merit, but the current pitch does not make a strong enough case for venture investment. The problem-solution fit needs significant refinement, and critical elements (defensibility, market sizing, team credentials, timing thesis) are underdeveloped. We recommend strengthening the narrative, gathering more customer validation, and building initial traction before approaching VCs.";
  } else {
    vcPerspective = "At this stage, the business case is not compelling enough for institutional venture capital. The problem-solution logic is unclear, the market opportunity is not well-defined, and critical risks are unaddressed. The team should focus on customer discovery, refining the product hypothesis, and building initial traction before seeking institutional investment.";
  }

  return {
    score: rawScore,
    strengths: strengths.length > 0 ? strengths : ["Basic problem-solution framework is in place"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Problem-solution fit could be tighter"],
    suggestions: suggestions.length > 0 ? suggestions : ["Strengthen the logical connection between problem and solution"],
    identifiedProblem,
    identifiedSolution,
    painSeverity,
    marketRelevance: marketSlide
      ? "Strong alignment with a growing market trend"
      : "Not clearly established — market relevance needs definition",
    scalabilityPotential,
    risks: [...new Set(risks)],
    vcPerspective,
  };
}

function computeOverallScore(dimensions: {
  communication: number;
  narrative: number;
  problemSolution: number;
}) {
  const weights = { communication: 0.25, narrative: 0.35, problemSolution: 0.4 };
  const overall = Math.round(
    dimensions.communication * weights.communication +
    dimensions.narrative * weights.narrative +
    dimensions.problemSolution * weights.problemSolution
  );
  let verdict: InvestorReport["verdict"];
  let detailedVerdict: string;
  if (overall >= 80) { verdict = "Strong Investment Opportunity"; detailedVerdict = "Strong Buy — well-positioned for venture investment"; }
  else if (overall >= 70) { verdict = "Strong Investment Opportunity"; detailedVerdict = "Buy — compelling deck with minor areas for improvement"; }
  else if (overall >= 55) { verdict = "Promising but Needs Improvement"; detailedVerdict = "Hold — promising concept with execution questions"; }
  else if (overall >= 40) { verdict = "Promising but Needs Improvement"; detailedVerdict = "Weak Hold — significant gaps in narrative and positioning"; }
  else { verdict = "High Risk / Weak Investment Case"; detailedVerdict = "Sell — major structural gaps in the investment thesis"; }
  return { overallScore: Math.min(99, Math.max(5, overall)), verdict, detailedVerdict };
}

function generateTopStrengths(report: InvestorReport): string[] {
  const pool = [
    ...report.communication.strengths.slice(0, 2),
    ...report.narrative.strengths.slice(0, 2),
    ...report.problemSolution.strengths.slice(0, 2),
  ];
  return pool.filter((s) => s.length > 10).slice(0, 3);
}

function generateTopRisks(report: InvestorReport): string[] {
  const pool = [
    ...report.problemSolution.risks.slice(0, 2),
    ...report.narrative.weaknesses.slice(0, 1),
    ...report.communication.weaknesses.slice(0, 1),
  ];
  return pool.filter((r) => r.length > 10).slice(0, 3);
}

function generateInvestorQuestions(report: InvestorReport): InvestorQuestion[] {
  const { narrative, problemSolution, communication } = report;
  const allWeaknesses = [...narrative.weaknesses, ...problemSolution.weaknesses, ...communication.weaknesses];
  const weaknessesText = allWeaknesses.join(" ").toLowerCase();

  const questions: InvestorQuestion[] = [];

  const hasMoat = weaknessesText.includes("defensib") || weaknessesText.includes("moat") || weaknessesText.includes("competit");
  if (hasMoat && problemSolution.score < 70) {
    questions.push({
      question: "You haven't clearly articulated your defensible advantage. What proprietary assets — data, technology, network effects, or deep integrations — will prevent well-funded competitors from replicating your solution within 12 months? Be specific about what takes years to build.",
      context: "Feature-level differentiation is temporary. The best founder answers cite specific, defensible elements that compound over time. Investors probe this relentlessly.",
      difficulty: "Advanced",
    });
  } else {
    questions.push({
      question: "Your defensibility thesis mentions [specific advantage]. How does this moat compound over time? Walk us through the unit economics of your moat — does it get stronger with every customer, every data point, or every integration?",
      context: "Investors want to understand whether your advantage is static (patents, IP) or dynamic (network effects, data network effects). Dynamic moats are more valuable.",
      difficulty: "Advanced",
    });
  }

  questions.push({
    question: "Walk us through your unit economics in detail. What is your CAC by channel, LTV by cohort, gross margin, and payback period? How do these compare to public company benchmarks in your space, and how do they evolve as you scale from your first 100 customers to your first 10,000?",
    context: "SaaS investors expect founders to know their unit economics cold. Vague answers suggest lack of financial modeling rigor. The best founders can recite these numbers without looking at notes.",
    difficulty: "Advanced",
  });

  const hasCompetition = weaknessesText.includes("competit");
  if (hasCompetition) {
    questions.push({
      question: "You haven't addressed the competitive landscape. Who are the top 3–5 players in this space — including incumbents and well-funded startups — and what is your specific, asymmetric advantage against each one? What prevents them from adding your feature set in their next release?",
      context: "Investors conduct competitive diligence. They need to see you understand the landscape and have a realistic, differentiated positioning. Failure to articulate this credibly is a major red flag.",
      difficulty: "Advanced",
    });
  } else {
    questions.push({
      question: "Your competitive positioning mentions [competitor names]. What is your asymmetric advantage — what can you do that incumbents and well-funded competitors cannot easily replicate? Is it data network effects, deep workflow integration, regulatory advantage, or something else?",
      context: "The best founder answers reveal asymmetric advantages that compound over time. Generic claims like 'better UX' or 'we're faster' are not defensible.",
      difficulty: "Intermediate",
    });
  }

  const missingTeam = narrative.missingElements.some((m) => m.toLowerCase().includes("team"));
  if (missingTeam) {
    questions.push({
      question: "Why is this the right team to execute on this opportunity? What specific domain expertise, industry relationships, or unique insights do you have that give you an edge that no other team can replicate?",
      context: "Team-market fit is the #1 criterion for early-stage investors. Founders who have worked on this specific problem for years, or bring unique domain expertise, are significantly more likely to receive funding.",
      difficulty: "Intermediate",
    });
  } else {
    questions.push({
      question: "Your team background is strong in [area]. What are the 3–4 key hires you need to make in the next 12 months, and what is your specific strategy for attracting A+ talent when competing with larger companies for the same candidates?",
      context: "Investors evaluate whether founders have realistic hiring plans and understand talent market dynamics. Top-tier talent acquisition strategy signals founder maturity.",
      difficulty: "Intermediate",
    });
  }

  const hasTiming = weaknessesText.includes("why now") || weaknessesText.includes("timing");
  if (hasTiming) {
    questions.push({
      question: "Why is NOW the right time to build this? What has changed in the last 18–24 months — technology shifts, regulatory changes, or behavioral trends — that makes this opportunity accessible today that wasn't possible or attractive before?",
      context: "Market timing is one of the most critical venture factors. Great answers reference specific, verifiable shifts. Weak answers cite generic trends.",
      difficulty: "Intermediate",
    });
  } else {
    questions.push({
      question: "Beyond the immediate product roadmap, what is your 5–7 year vision for the company? If everything breaks right, what does this business look like, and what specific milestones would need to be true for this to be the category-defining company in this space?",
      context: "VCs invest in outlier outcomes. This question separates operators with a vision from those executing a feature. The best answers show ambitious yet grounded thinking about market transformation.",
      difficulty: "Basic",
    });
  }

  if (report.communication.score < 65) {
    questions.splice(2, 0, {
      question: "Your deck has some communication clarity issues we'd like to understand better. Can you explain your core value proposition in one sentence — what do you do, for whom, and why is it dramatically better than existing alternatives?",
      context: "Founders who cannot articulate their value proposition succinctly in conversation raise concerns about product clarity and go-to-market messaging. This is a foundational capability investors evaluate in every interaction.",
      difficulty: "Basic",
    });
  }

  return questions.slice(0, 5);
}

export async function evaluateDeck(request: EvaluationRequest): Promise<EvaluationResult> {
  const { content, startupName, tagline } = request;
  if (!content || content.trim().length < 20) {
    throw new Error("Deck content is too short. Please provide more detailed pitch deck content.");
  }

  const slides = detectSlideCategories(content);
  const { detected, missing } = extractCategories(slides);

  const communication = analyzeCommunication(slides);
  const narrative = analyzeNarrative(slides);
  const problemSolution = analyzeProblemSolution(slides);

  const { overallScore, verdict } = computeOverallScore({
    communication: communication.score,
    narrative: narrative.score,
    problemSolution: problemSolution.score,
  });

  let extractedName = startupName;
  let extractedTagline = tagline;
  if (!extractedName) {
    const cover = slides.find((s) => s.category === "Cover");
    if (cover) {
      const lines = cover.content.split("\n").filter(Boolean);
      extractedName = lines[0]?.trim() || "Unnamed Startup";
      if (!extractedTagline) extractedTagline = lines[1]?.trim() || "";
    } else {
      const firstLine = content.split("\n")[0]?.trim() || "";
      extractedName = firstLine.length > 30 ? firstLine.slice(0, 30) : firstLine || "Pitch Deck";
    }
  }

  const report: InvestorReport = {
    startupName: extractedName || "Pitch Deck",
    tagline: extractedTagline || "AI-Powered Pitch Deck Evaluation",
    overallScore,
    verdict,
    communication,
    narrative,
    problemSolution,
    topStrengths: [],
    topRisks: [],
    mostCriticalImprovement: "",
    investorQuestions: [],
    radarData: [
      { dimension: "Communication & Clarity", score: communication.score },
      { dimension: "Narrative & Storytelling", score: narrative.score },
      { dimension: "Problem-Solution Fit", score: problemSolution.score },
      { dimension: "Market Opportunity", score: Math.min(98, problemSolution.score + 5) },
      { dimension: "Team & Execution", score: Math.min(98, narrative.score + 3) },
      { dimension: "Investor Appeal", score: Math.min(98, overallScore + 8) },
    ],
    generatedAt: new Date().toISOString(),
    deckOverview: {
      totalSlides: slides.length,
      detectedCategories: detected,
      missingCategories: missing,
    },
  };

  report.topStrengths = generateTopStrengths(report);
  report.topRisks = generateTopRisks(report);
  report.mostCriticalImprovement = generateCriticalImprovement(narrative, problemSolution);
  report.investorQuestions = generateInvestorQuestions(report);

  return {
    report,
    id: `eval-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

function generateCriticalImprovement(
  narrative: InvestorReport["narrative"],
  problemSolution: InvestorReport["problemSolution"]
): string {
  const critical = [];

  if (narrative.missingElements.length > 2) {
    critical.push(`Add missing narrative sections: ${narrative.missingElements.slice(0, 3).join(", ")}`);
  }

  const defWeakness = problemSolution.weaknesses.find((w) =>
    w.toLowerCase().includes("defensib") || w.toLowerCase().includes("moat") || w.toLowerCase().includes("competit")
  );
  if (defWeakness) {
    critical.push("Develop a clear defensibility and competitive moat argument with specific proprietary advantages");
  }

  if (problemSolution.score < 65) {
    critical.push("Strengthen the problem-solution fit with quantified pain points, market data, and clearer differentiation logic");
  }

  if (critical.length === 0) {
    return "Add a detailed use of funds section and a 12–18 month milestone roadmap to give investors confidence in your capital allocation and execution timeline.";
  }
  return critical.slice(0, 2).join(". ") + ".";
}
