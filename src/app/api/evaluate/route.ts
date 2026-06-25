import { NextRequest, NextResponse } from "next/server";
import { evaluateDeck } from "@/services/evaluator";
import { evaluateDeckAI } from "@/services/ai-evaluator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.content || typeof body.content !== "string" || body.content.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide detailed pitch deck content (at least 20 characters)." },
        { status: 400 }
      );
    }

    const useAI = !!process.env.GROQ_API_KEY;
    const result = useAI ? await evaluateDeckAI(body) : await evaluateDeck(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
