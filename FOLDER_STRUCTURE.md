# Folder Structure Explanation

```
venturelens/
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/evaluate/route.ts     # POST/GET API for deck evaluation
│   │   ├── dashboard/page.tsx        # SaaS dashboard with upload & history
│   │   ├── results/[id]/page.tsx     # Dynamic investor report page
│   │   ├── page.tsx                  # Landing page (hero + sections)
│   │   ├── layout.tsx                # Root HTML layout with fonts
│   │   └── globals.css               # Design tokens, themes, animations
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
│   │   │   └── sidebar.tsx           # Collapsible sidebar navigation
│   │   │
│   │   └── results/                  # Results page components
│   │       ├── score-ring.tsx        # Animated SVG score ring
│   │       ├── radar-chart.tsx       # Recharts radar visualization
│   │       ├── dimension-card.tsx    # Score card with strengths/weaknesses
│   │       └── question-card.tsx     # VC question display with context
│   │
│   ├── services/
│   │   ├── evaluator.ts              # Core AI evaluation engine
│   │   └── sampleData.ts             # SupportAI sample evaluation
│   │
│   ├── types/
│   │   └── index.ts                  # All TypeScript interfaces & types
│   │
│   └── lib/
│       └── utils.ts                  # cn(), scoreColor(), formatDate(), etc.
│
├── public/                           # Static assets
├── ARCHITECTURE.md                   # Architecture & data flow diagrams
├── PRESENTATION.md                   # 7-slide presentation content
├── README.md                         # Project overview & setup
├── package.json
└── tsconfig.json
```

## Key Design Decisions

**Abstracted AI Service Layer** (`src/services/evaluator.ts`): The evaluation engine is a pure function that takes `EvaluationRequest` and returns `EvaluationResult`. This allows swapping in OpenAI/Claude/Gemini without changing any UI code.

**Centralized Type System** (`src/types/index.ts`): All interfaces (InvestorReport, DimensionScore, SlideCategory, etc.) are defined in one place, ensuring type safety across the entire pipeline.

**Component Primitives** (`src/components/ui/`): Custom button, card, and progress components built with class-variance-authority patterns — similar to shadcn/ui — giving consistent design language without external dependencies.

**Animated Feedback**: Framer Motion powers all animations — score rings, progress bars, list entries, and page transitions — creating a polished, premium feel.
