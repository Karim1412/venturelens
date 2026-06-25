import { NextRequest, NextResponse } from "next/server";
import { evaluateDeck } from "@/services/evaluator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.content || typeof body.content !== "string" || body.content.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide detailed pitch deck content (at least 20 characters)." },
        { status: 400 }
      );
    }
    const result = await evaluateDeck(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
