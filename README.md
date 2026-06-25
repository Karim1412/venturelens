# VentureLens AI

**AI-Powered Pitch Deck Evaluation Platform**

VentureLens AI evaluates startup pitch decks from an investor perspective, providing venture-grade analysis across communication, narrative, and problem-solution fit dimensions.

---

## Architecture

```
venturelens/
├── src/
│   ├── app/
│   │   ├── api/evaluate/route.ts    # API endpoint for deck evaluation
│   │   ├── dashboard/page.tsx       # SaaS dashboard with upload zone
│   │   ├── results/[id]/page.tsx    # Investor report page
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Theme & design tokens
│   ├── components/
│   │   ├── ui/                      # Primitive components (Button, Card, Progress, etc.)
│   │   ├── landing/                 # Landing page sections
│   │   ├── layout/                  # Sidebar navigation
│   │   └── results/                 # Report components (ScoreRing, RadarChart, etc.)
│   ├── services/
│   │   ├── evaluator.ts             # AI evaluation pipeline engine
│   │   └── sampleData.ts            # Sample startup evaluation data
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── lib/
│       └── utils.ts                 # Utility functions & helpers
├── public/
├── package.json
└── tsconfig.json
```

## AI Evaluation Engine

The evaluation pipeline (`src/services/evaluator.ts`) processes deck content through 5 stages:

1. **Slide Detection** — Categorizes content into slide types (Cover, Problem, Solution, Market, etc.)
2. **Communication Analysis** — Evaluates grammar, clarity, conciseness, and writing quality
3. **Narrative Analysis** — Assesses story flow, missing sections, and persuasiveness
4. **Problem-Solution Fit** — Validates pain severity, market relevance, and scalability
5. **Report Generation** — Computes weighted scores and generates investor report

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
| AI Service | Abstract evaluator layer (OpenAI/Claude ready) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

- OpenAI/Claude/Gemini integration for deeper analysis
- PDF/PPTX file parsing (pdf.js, pptxjs)
- User authentication and history persistence
- Batch analysis and portfolio tracking
- Custom evaluation frameworks
- Export to PDF/PPTX
- Competitive landscape analysis
- Real-time collaborative feedback

---

Built for founders, investors, and accelerators who want to understand how their pitch decks perform before meeting VCs.
