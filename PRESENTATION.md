# VentureLens AI — Presentation Slides

---

## Slide 1: Problem

**Founders don't know how investors see their startups.**

- Most pitch decks fail because founders lack investor perspective
- Getting feedback from VCs requires warm intros and weeks of waiting
- Generic AI feedback is too vague to be actionable
- Founders need structured, honest, investor-grade evaluation

---

## Slide 2: Solution

**VentureLens AI — AI-powered pitch deck evaluation.**

- Upload your deck (PDF, PPTX, or text)
- AI analyzes across 3 investor dimensions:
  - Communication & Clarity
  - Narrative & Storytelling
  - Problem-Solution Fit
- Receive a complete investor report with scores, risks, and VC questions

---

## Slide 3: Architecture

**Clean, modular, production-ready.**

- **Frontend:** Next.js 16 App Router + TypeScript + TailwindCSS v4
- **UI:** Custom component library with Framer Motion animations
- **Charts:** Recharts radar and score visualizations
- **API:** Next.js API Routes with abstracted service layer
- **AI:** Modular evaluator engine (ready for OpenAI/Claude/Gemini)
- **Types:** Full TypeScript type safety across the entire pipeline

---

## Slide 4: AI Evaluation Logic

**5-stage evaluation pipeline.**

1. **Slide Detection** — Regex-based categorization into 10 slide types
2. **Communication Score** — Grammar, clarity, conciseness analysis
3. **Narrative Score** — Story flow, missing sections, persuasiveness
4. **Problem-Solution Score** — Pain severity, market fit, scalability
5. **Weighted Report** — 25/35/40 weighting → Verdict + VC Questions

Verdict thresholds:
- ≥ 75 → Strong Investment Opportunity
- 50–74 → Promising but Needs Improvement
- < 50 → High Risk / Weak Investment Case

---

## Slide 5: Demo Flow

**From upload to investor insights in seconds.**

1. Landing page → "Try Demo" → Sample report
2. Dashboard → Upload zone with drag & drop + text input
3. Results page shows:
   - Overall score ring with animated progress
   - Multi-dimensional radar chart
   - 3 dimension cards with strengths/weaknesses/suggestions
   - Top strengths & risks
   - Critical improvement recommendation
   - **5 VC questions** with context and difficulty levels

---

## Slide 6: Sample Evaluation

**SupportAI — AI Customer Support Platform**

- Overall Score: **72/100** — "Promising but Needs Improvement"
- Communication: 78 — Clean design, but text density issues
- Narrative: 65 — Missing TAM/SAM/SOM and competitive landscape
- Problem-Solution: 74 — Strong problem, weak defensibility

Key insight: The "Investor Questions" feature generated 5 VC-level questions including defensibility, unit economics, and team-market fit — demonstrating deep investor thinking.

---

## Slide 7: Future Improvements

**Roadmap to production.**

1. **AI Integration** — Connect OpenAI/Claude/Gemini for deeper analysis
2. **File Parsing** — PDF.js and PPTX parsing for direct file upload
3. **Auth & Storage** — User accounts with evaluation history
4. **Portfolio Mode** — Batch analysis for accelerators and VCs
5. **Custom Frameworks** — Configurable evaluation dimensions
6. **Export** — PDF report export and slide-by-slide feedback
7. **Competitive Intel** — Automatic competitor landscape generation
