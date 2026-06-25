# Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend"
        L[Landing Page]
        D[Dashboard]
        R[Results Page]
    end

    subgraph "Components"
        UI[UI Primitives<br/>Button, Card, Progress]
        RES[Results Components<br/>ScoreRing, RadarChart<br/>DimensionCard, QuestionCard]
        LAY[Layout<br/>Sidebar]
    end

    subgraph "API Layer"
        API[Next.js API Routes<br/>POST /api/evaluate]
    end

    subgraph "Services"
        EV[Evaluator Engine<br/>slide detection, scoring<br/>report generation]
        SD[Sample Data<br/>SupportAI example]
    end

    subgraph "Types"
        T[TypeScript Types<br/>InvestorReport, DimensionScore<br/>SlideCategory]
    end

    L --> D
    D --> API
    API --> EV
    EV --> T
    D --> R
    R --> EV
    R --> SD
    UI --> L
    UI --> D
    UI --> R
    RES --> R
    LAY --> D
    LAY --> R
```

## Data Flow

```mermaid
sequenceDiagram
    User->>Dashboard: Upload deck / paste text
    Dashboard->>API: POST /api/evaluate
    API->>Evaluator: evaluateDeck(content)
    Evaluator->>Evaluator: detectSlideCategories()
    Evaluator->>Evaluator: analyzeCommunication()
    Evaluator->>Evaluator: analyzeNarrative()
    Evaluator->>Evaluator: analyzeProblemSolution()
    Evaluator->>Evaluator: computeOverallScore()
    Evaluator->>Evaluator: generateReport()
    API-->>Dashboard: EvaluationResult
    Dashboard->>Results: Navigate to /results/[id]
    Results->>Results: Render investor report
```

## Evaluation Pipeline

```mermaid
flowchart LR
    A[Raw Deck Content] --> B[Slide Detection]
    B --> C1[Communication Analysis]
    B --> C2[Narrative Analysis]
    B --> C3[Problem-Solution Fit]
    C1 --> D[Weighted Scoring]
    C2 --> D
    C3 --> D
    D --> E[Verdict Decision]
    E --> F[Investor Report]
    F --> G[5 VC Questions]
```
