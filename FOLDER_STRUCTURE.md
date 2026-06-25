# Folder Structure Explanation

```
venturelens/
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/evaluate/route.ts     # POST API — auto-selects evaluator
│   │   ├── dashboard/page.tsx        # New Analysis: paste text, load examples
│   │   ├── results/[id]/page.tsx     # Dynamic investor report page
│   │   ├── page.tsx                  # Redirects to /dashboard
│   │   ├── layout.tsx                # Root HTML layout with Geist font
│   │   └── globals.css               # TailwindCSS v4 theme tokens
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable primitive components
│   │   │   ├── button.tsx            # Multi-variant button (primary/secondary/ghost)
│   │   │   ├── card.tsx              # Card container with variants
│   │   │   ├── progress.tsx          # Animated progress bar
│   │   │   └── collapsible.tsx       # Expandable section with animation
│   │   │
│   │   ├── landing/                  # Landing page section components
│   │   │   ├── hero.tsx              # Main hero with headline & CTA
│   │   │   ├── how-it-works.tsx      # 4-step process flow
│   │   │   ├── framework.tsx         # 3 evaluation dimensions
│   │   │   ├── sample-report.tsx     # Demo CTA with score preview
│   │   │   └── footer.tsx            # Site footer
│   │   │
│   │   ├── layout/
│   │   │   └── sidebar.tsx           # Collapsible sidebar (New Analysis, History)
│   │   │
│   │   └── results/                  # Results page components
│   │       ├── score-ring.tsx        # Animated SVG score ring
│   │       ├── radar-chart.tsx       # Recharts radar visualization
│   │       ├── dimension-card.tsx    # Score card with strengths/weaknesses
│   │       └── question-card.tsx     # VC question display with context
│   │
│   ├── services/
│   │   ├── ai-evaluator.ts           # Groq LLM evaluation (when key is set)
│   │   ├── evaluator.ts              # Heuristic evaluation (fallback, ~200 rules)
│   │   ├── examples.ts               # Famous startup deck examples (Airbnb, Uber, Mint)
│   │   └── sampleData.ts             # SupportAI sample evaluation
│   │
│   ├── types/
│   │   └── index.ts                  # All TypeScript interfaces & types
│   │
│   └── lib/
│       └── utils.ts                  # cn(), scoreColor(), formatDate(), etc.
│
├── docs/
│   └── presentation.md               # Technical presentation (7 sections)
│
├── public/                           # Static assets
├── .env.example                      # Groq API key template
├── vercel.json                       # Vercel deployment config
├── ARCHITECTURE.md                   # Architecture & data flow diagrams
├── FOLDER_STRUCTURE.md               # This file
├── PRESENTATION.md                   # Legacy presentation (moved to docs/)
├── README.md                         # Project overview & setup
├── package.json
└── tsconfig.json
```

## Key Design Decisions

**Hybrid AI Service Layer** (`src/services/`): Two evaluators co-exist — `ai-evaluator.ts` calls Groq LLM (Llama 3 70B) via `groq-sdk`, while `evaluator.ts` runs a heuristic engine with ~200 rules. The API route selects between them by checking `GROQ_API_KEY`. Both implement the same `evaluateDeck()` interface and return the same `EvaluationResult` type.

**Centralized Type System** (`src/types/index.ts`): All interfaces (InvestorReport, DimensionScore, SlideCategory, etc.) are defined in one place, ensuring type safety across the entire pipeline. The LLM prompt includes the full type definition so Groq returns JSON that matches the frontend exactly.

**Component Primitives** (`src/components/ui/`): Custom button, card, and progress components built with class-variance-authority patterns — similar to shadcn/ui — giving consistent design language without external dependencies.

**Animated Feedback**: Framer Motion powers all animations — score rings, progress bars, list entries, and page transitions — creating a polished, premium feel.

**No Global State**: sessionStorage bridges dashboard → results, keeping the MVP deployable without a database. Example decks in `examples.ts` let users test instantly with realistic content.
