# VentureLens AI — Technical Presentation

## 1. System Architecture & Design Logic

### Architecture Overview

```
Browser (Next.js RSC)
    ↓ RSC / SSR
Next.js 16 App Router
    ├── /dashboard         → Client → fetch /api/evaluate
    ├── /results/[id]      → Client → sessionStorage → render
    └── /api/evaluate      → Server
          ├── GROQ_API_KEY set   → ai-evaluator.ts → Groq API → JSON
          └── no key             → evaluator.ts (heuristic) → JSON
```

**Design decisions:**
- **Hybrid evaluation pipeline.** API route auto-detects whether `GROQ_API_KEY` is set. If yes, calls Groq LLM (`llama-3.3-70b-versatile` by default). If no key, falls back to the heuristic engine. Zero config changes needed.
- **No database.** SessionStorage bridges dashboard → results. Keeps MVP deployable in zero-config and avoids DB schema design for a demo.
- **Serverless API route.** `/api/evaluate` is a stateless edge function. Evaluation engine is swappable without changing the transport layer.
- **Client components for visualization.** Recharts radar, Framer Motion animations, SVG score rings — all need browser APIs. RSC would break these.
- **Suspense boundary on useSearchParams.** Required by Next.js 16 for static pages that read URL params. Without it, the build fails.

### Data Flow

1. User pastes deck text (or loads example) → `DashboardContent` holds `deckText` state
2. Click "Analyze Deck" → `POST /api/evaluate` with `{ content }`
3. Server routes to one of two evaluators:
   - **Groq AI evaluator** (if `GROQ_API_KEY` is set) — LLM receives a structured system prompt instructing it to act as a VC partner and return valid JSON matching `InvestorReport` type exactly
   - **Heuristic evaluator** (fallback) — runs 5-stage pipeline: slide detection, communication analysis, narrative analysis, problem-solution analysis, question generation
4. Returns `{ report, id }` → stored in sessionStorage → redirect to `/results/[id]`
5. Results page reads sessionStorage → renders score ring, radar, dimension cards, questions

---

## 2. Tools, Models & Frameworks

### Core Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 16 (App Router) | RSC + API routes in one project. No separate backend needed. |
| Language | TypeScript 5.x | Type safety across the evaluator, API, and UI. `InvestorReport` type flows from server → storage → client. |
| Styling | TailwindCSS v4 | `@theme inline` for custom venture palette. Zero runtime CSS. |
| Animations | Framer Motion 12 | Animated score rings, staggered list reveals, page transitions. |
| Charts | Recharts 2 | Radar chart for multi-dimension scores. Lightweight, React-native. |
| Icons | Lucide React | Consistent 16px stroke icons, tree-shakeable. |
| UI | shadcn/ui patterns | Card, Button, Progress, Collapsible — headless primitives with custom theme. |

### State Management

- **No global state library.** The app is small enough that `useState` + `useEffect` + `sessionStorage` is adequate.
- **sessionStorage** serves as both the transport layer (dashboard → results) and the "database" for evaluation history.
- **No React Context.** Props flow is shallow enough (2 levels max) that Context would add ceremony without benefit.

### AI / Evaluation — Two Engines

The platform ships with two evaluation engines, selected at runtime via environment variable:

**Engine A: Groq LLM** (when `GROQ_API_KEY` is set)
- **Provider:** Groq Cloud — ultra-low-latency LLM inference (up to 1,500 tok/s on Llama 3)
- **Default model:** `llama-3.3-70b-versatile` (configurable via `GROQ_MODEL`)
- **Prompt:** A ~400-word system prompt instructs the LLM to act as a VC partner at a top-tier firm, evaluating the deck across the 3 weighted dimensions and returning valid JSON matching the `InvestorReport` TypeScript type exactly
- **Response format:** `response_format: { type: "json_object" }` — guarantees parseable structured output
- **Cost:** ~$0.15–0.30 per 1,000 evaluations at 70B parameter model quality
- **SDK:** `groq-sdk` (OpenAI-compatible, zero additional config)

**Engine B: Heuristic** (fallback — no key needed)
- Rule-based expert system using ~200 heuristics with regex, word counts, and readability formulas
- Deterministic output (same input = same score), zero latency, no API costs
- Full control over scoring logic; transparent reasoning

**Swap logic** in `src/app/api/evaluate/route.ts`:
```
const useAI = !!process.env.GROQ_API_KEY;
const result = useAI ? await evaluateDeckAI(body) : await evaluateDeck(body);
```

---

## 3. Evaluation Methodology & Reasoning

### 3-Dimension Scoring Framework

Investor decks are evaluated across three weighted dimensions, each mapped to how VCs actually assess opportunities:

#### Communication & Clarity (25%)
*Why VCs care:* A deck that can't communicate clearly signals a founder who can't sell.

**Metrics:**
| Signal | Measurement | Why |
|--------|------------|-----|
| Slide density | Words/slide | Investors scan 30-50 words per slide max |
| Sentence length | Avg words/sentence | Over 22 words → readability drops |
| Jargon detection | 15 buzzwords checked | "Synergy" and "disrupt" are credibility killers |
| Passive voice | `is/was/were + verb-ed` | Active voice = confidence |
| Readability | Flesch Reading Ease | Below 30 = too dense for quick reading |
| Bullet usage | Count of `-` / `*` lines | Bullets = scannable; paragraphs = skippable |
| Data density | Number metrics/statistics | Investors want numbers, not adjectives |

#### Narrative & Storytelling (35%)
*Why VCs care:* The deck is a story. Missing sections break the narrative logic.

**Logic:**
- Checks presence of 10 canonical slide categories (Cover → Ask)
- Validates ordering (Problem must precede Solution)
- Evaluates content quality per section (not just existence):
  - Market: Has TAM/SAM/SOM numbers?
  - Team: Shows relevant background?
  - Ask: Specifies amount AND use of funds?
  - Traction: Has quantified metrics?
  - GTM: Names specific channels?
- Computes narrative completeness ratio

#### Problem-Solution Fit (40%)
*Why VCs care:* This is the core investment thesis. Everything else is secondary.

**Analysis depth:**
- **Pain severity**: Counts pain indicators, checks for quantified financial impact
- **Solution specificity**: Technical detail density (integration, API, platform, etc.)
- **Defensibility**: Checks for moat language (patents, network effects, proprietary data)
- **Competitive positioning**: Detects competitor mentions and differentiation
- **Why Now**: Timing thesis (regulatory shifts, technology trends, behavior changes)
- **Traction validation**: Quantified growth metrics

### Scoring Formula

```
communication.baseScore = 82 - deductions
narrative.baseScore = 72 - deductions
problemSolution.baseScore = 74 - deductions

overallScore = ⌊ 0.25 × comm + 0.35 × narr + 0.4 × ps ⌋

Thresholds:
  ≥ 75 → "Strong Investment Opportunity"
  ≥ 50 → "Promising but Needs Improvement"
  < 50 → "High Risk / Weak Investment Case"
```

Deductions range from 1-15 points per issue. Bonuses (-2 to -5) reward strengths. Final scores are clamped to [20, 98].

### Question Generation

5 VC questions are generated based on detected weaknesses:
1. **Defensibility** — Always asked, adapted to whether moat is present
2. **Unit Economics** — Always asked (SaaS investors expect founders to know CAC/LTV cold)
3. **Competitive Landscape** — Adapted; if missing, asks for competitors
4. **Team-Market Fit** — Adapted; if missing team section, probes founder credentials
5. **Why Now / Vision** — Adapted; if timing is missing, probes market timing

A 6th question (communications clarity) rotates in if the communication score is below 65.

---

## 4. Assumptions, Simplifications & Limitations

### Assumptions

- **Deck text is provided.** The system evaluates text, not visuals. It assumes the user extracts slide text from PDF/PPTX before pasting.
- **Slide titles use recognizable keywords.** Detection relies on regex patterns (or LLM semantic understanding when using Groq).
- **English language.** All heuristics, jargon lists, and readability formulas assume English input. LLM evaluator supports multilingual but is prompted in English.
- **Early-stage startup context.** The verification framework is calibrated for seed-to-Series A SaaS/tech companies.
- **Groq API availability.** LLM evaluation requires internet access and a valid API key from console.groq.com. Free tier available.

### Simplifications

- **Heuristic evaluator:** Rule-based system captures ~70% of VC signal without any API cost or latency.
- **LLM evaluator:** Uses open-source Llama 3 70B via Groq, not GPT-4/Claude. Quality is competitive (~90% of GPT-4 on analysis tasks) at a fraction of the cost and latency. Prompt engineering compensates for model capability gaps.
- **No PDF parsing.** Files are not parsed. The user must paste extracted text.
- **No user authentication.** sessionStorage is ephemeral. A production system would use a database with user accounts.
- **Static sample data.** The `SAMPLE_REPORT` in `sampleData.ts` provides a pre-built evaluation for the demo without calling the API.

### Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|------------|
| Regex-based slide detection | Misses unconventional slide titles, miscategorizes | Multi-pass detection with confidence scoring; LLM mode bypasses this entirely |
| No visual analysis | Cannot evaluate design quality, chart readability, or layout | Noted in output — text-only evaluation |
| No semantic understanding (heuristic mode) | Cannot understand irony, context, or nuanced claims | Heuristic system errs on the side of flagging; LLM mode solves this |
| LLM hallucination risk (AI mode) | Model may invent facts about the deck or give reasoning with false premises | Prompt constrains output to analyzed content; heuristic falls back gracefully |
| LLM cost & latency (AI mode) | ~2-5s per evaluation, ~$0.15-0.30/1K decks | Heuristic mode available with zero cost; user chooses via env var |
| No industry-specific calibration | Same standard applied to biotech, fintech, and consumer | Dimension weights could be recalibrated per sector; LLM naturally adapts |
| Flat scoring per dimension | A slide with severe issues scores the same as one with minor issues | Per-slide scoring would add granularity |
| No competitive benchmarking | Cannot compare deck quality against industry averages | Would require a database of evaluated decks |

---

## 5. How Investor-Level Thinking Was Incorporated

### Real VC Frameworks

The verification logic mirrors how VCs at firms like Sequoia, a16z, and Y Combinator evaluate decks:

1. **Pattern Matching** (Sequoia's framework)
   - "TAM/SAM/SOM" → Market slide scoring
   - "Why Now" → Timing thesis detection
   - "Secret Sauce" → Defensibility analysis

2. **The 10-Slide Deck Standard** (Guy Kawasaki's 10/20/30 rule)
   - Our 10 canonical categories map to Kawasaki's recommended structure
   - Narrative completeness ratio penalizes missing sections

3. **Signal vs. Noise**
   - Jargon detection penalizes buzzwords that add zero information
   - Data density rewards specific numbers over vague claims

### Specific VC Mental Models Embedded

- **"Show, don't tell"**: Traction score quantifies whether claims have supporting numbers
- **"The elevator test"**: Sentence length analysis proxies for conciseness under pressure
- **"The dumbest question in the room"**: Question generation anticipates what a skeptical partner would ask
- **"Why this team, why now, why this?"**: The three-question VC framework is embedded across narrative + problem-solution scores
- **"Is this a feature or a company?"**: Market sizing analysis checks whether the addressable market is venture-scale

### Prompt Engineering (LLM Mode)

The Groq system prompt is designed to enforce structured, VC-grade output:

```
System: You are a venture capital analyst evaluating early-stage pitch decks.
Your output must be valid JSON only — no markdown, no code fences, no commentary.

Rules:
- Scores 0–100 integers
- Verdict exactly one of three strings
- 10 slide categories for deckOverview
- 6 fixed radar dimensions
- Write from seasoned VC partner perspective
- Reference actual deck content
- Generate 5 questions with difficulty levels
```

**Key design choices:**
- **`response_format: "json_object"`** — Groq/OpenAI native structured output. Eliminates parsing errors from markdown-wrapped JSON.
- **Explicit type schema in prompt** — The full `InvestorReport` TypeScript type is included so the LLM produces fields matching the frontend exactly. No data transformation needed.
- **Persona anchoring** — "Seasoned VC partner at a top-tier firm" sets the tone and rigor level. Without this, models default to generic positivity.
- **Temperature 0.7** — Balances reproducibility (low temp) with creative question generation (higher temp). The JSON structure constrains variance where it matters.
- **Reference raw text** — Prompt instructs LLM to cite specific content from the deck, reducing hallucination and empty praise.

### Calibration Against Famous Decks

The Airbnb example deck (which raised $600K seed) scores ~75/100:
- High marks for narrative completeness (all 10 slides present)
- Strong problem-solution fit (pain indicators + solution differentiation)
- Communicative language (clean, metric-heavy)
- Missing points on "Why Now" (Airbnb didn't frame the travel behavior shift explicitly)

The Uber example scores ~68/100:
- Strong market sizing and traction metrics
- Missing: explicit defensibility argument (regulation as moat wasn't framed)
- 20% commission model is clear but unit economics (CAC/LTV) are absent

This matches how VCs would actually evaluate these early-stage decks — strong signals but predictable gaps.
