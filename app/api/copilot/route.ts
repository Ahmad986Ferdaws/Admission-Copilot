import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { answerQuery, generateProgramExplanation } from "@/lib/llm/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type } = body;

    // For v1, using mock user
    const mockUserId = "john.doe@example.com";
    
    const user = await prisma.user.findUnique({
      where: { email: mockUserId },
      include: {
        profile: true,
        matches: {
          include: {
            program: {
              include: {
                university: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      );
    }

    // Handle different query types
    if (type === "explain" && body.programId) {
      // Explain a specific program
      const match = user.matches.find((m) => m.programId === body.programId);
      if (!match) {
        return NextResponse.json(
          { error: "Program not found in your matches" },
          { status: 404 }
        );
      }

      const explanation = await generateProgramExplanation({
        profile: user.profile,
        program: match.program,
        match: {
          fitScore: match.fitScore,
          tier: match.tier,
        },
      });

      return NextResponse.json({ response: explanation });
    } else {
      // General query about programs
      const response = await answerQuery({
        profile: user.profile,
        matches: user.matches,
        query: query,
      });

      return NextResponse.json({ response });
    }
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json(
      { error: "Failed to process your query" },
      { status: 500 }
    );
  }
}

