# VentureLens AI

**AI-Powered Pitch Deck Evaluation Platform**

VentureLens AI evaluates startup pitch decks from an investor perspective, providing venture-grade analysis across communication, narrative, and problem-solution fit dimensions.

---

## Architecture

```
venturelens/
├── src/
│   ├── app/
│   │   ├── api/evaluate/route.ts    # API endpoint (auto-selects evaluator)
│   │   ├── dashboard/page.tsx       # Analysis dashboard with paste & examples
│   │   ├── results/[id]/page.tsx    # Investor report page with scores & radar
│   │   ├── page.tsx                 # Redirects to /dashboard
│   │   ├── layout.tsx               # Root layout with Geist font
│   │   └── globals.css              # TailwindCSS v4 theme tokens
│   ├── components/
│   │   ├── ui/                      # Button, Card, Progress, Collapsible
│   │   ├── landing/                 # Landing page sections
│   │   ├── layout/                  # Sidebar navigation
│   │   └── results/                 # ScoreRing, RadarChart, DimensionCard, QuestionCard
│   ├── services/
│   │   ├── ai-evaluator.ts          # Groq LLM evaluation engine
│   │   ├── evaluator.ts             # Heuristic evaluation engine (fallback)
│   │   ├── examples.ts              # Famous startup deck examples
│   │   └── sampleData.ts            # Sample evaluation data for demo
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── lib/
│       └── utils.ts                 # Utility functions & helpers
├── docs/
│   └── presentation.md             # Technical presentation
├── .env.example                     # Groq API configuration template
├── vercel.json                      # Vercel deployment config
├── package.json
└── tsconfig.json
```

## AI Evaluation Engine

Two engines are available, auto-selected at runtime:

### Engine A: Groq LLM (recommended)

Set `GROQ_API_KEY` in `.env.local` to use Llama 3 70B via Groq Cloud for deep semantic analysis. The LLM acts as a VC partner and returns structured JSON matching the full `InvestorReport` type.

- **Model:** `llama-3.3-70b-versatile` (configurable via `GROQ_MODEL`)
- **Latency:** ~2–5s per evaluation
- **Cost:** ~$0.15–0.30 per 1,000 evaluations
- **Free tier:** Available at https://console.groq.com

### Engine B: Heuristic (fallback — no key needed)

Rule-based pipeline (`src/services/evaluator.ts`) with ~200 heuristics:

1. **Slide Detection** — Categorizes content into slide types
2. **Communication Analysis** — Readability, jargon, density, data points
3. **Narrative Analysis** — Section completeness, ordering, content quality
4. **Problem-Solution Fit** — Pain severity, defensibility, timing, competition
5. **Report Generation** — Weighted scores and VC questions

### Scoring Weights

- Communication & Clarity: 25%
- Narrative & Storytelling: 35%
- Problem-Solution Fit: 40%

### Verdict Thresholds

- **≥ 75**: Strong Investment Opportunity
- **50–74**: Promising but Needs Improvement
- **< 50**: High Risk / Weak Investment Case

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 |
| UI Primitives | Custom components (shadcn/ui patterns) |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| AI Service | Groq LLM (Llama 3 70B) + heuristic fallback |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Enable AI Mode (Optional)

```bash
cp .env.example .env.local
# Edit .env.local and add your Groq API key:
#   GROQ_API_KEY=gsk_your_key_here
```

Get a free key at https://console.groq.com/keys. Without the key, the heuristic engine runs automatically — no config needed.

## API

### POST /api/evaluate

Evaluate a pitch deck:

```json
{
  "content": "Slide 1: Cover\nSlide 2: Problem...",
  "startupName": "Optional",
  "tagline": "Optional"
}
```

### GET /api/evaluate

Returns the sample evaluation report.

## Future Improvements

- PDF/PPTX file parsing (pdf.js, pptxjs)
- User authentication and history persistence
- Batch analysis and portfolio tracking
- Custom evaluation frameworks per industry
- Export to PDF/PPTX
- Real-time collaborative feedback

---

Built for founders, investors, and accelerators who want to understand how their pitch decks perform before meeting VCs.
