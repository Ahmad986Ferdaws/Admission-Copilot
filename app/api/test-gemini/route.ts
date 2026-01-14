import { NextResponse } from "next/server";
import { generateProgramExplanation } from "@/lib/llm/gemini";

export async function GET() {
  try {
    // Test data
    const mockProfile = {
      citizenshipCountry: "Bangladesh",
      residenceCountry: "Bangladesh",
      targetCountries: ["USA", "Canada"],
      degreeLevel: "Masters",
      majorInterests: ["Computer Science", "Data Science"],
      gpa: 3.7,
      gpaScale: "4.0",
      englishTestType: "IELTS",
      englishScore: 7.5,
      budgetMin: 20000,
      budgetMax: 40000,
      intakeTerm: "Fall",
      intakeYear: 2025,
    };

    const mockProgram = {
      name: "Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 30000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2025-01-15"),
      university: {
        name: "University of Toronto",
        country: "Canada",
        city: "Toronto",
      },
    };

    const mockMatch = {
      fitScore: 85,
      tier: "SAFE",
    };

    // Test the Gemini integration
    const explanation = await generateProgramExplanation({
      profile: mockProfile,
      program: mockProgram,
      match: mockMatch,
    });

    return NextResponse.json({
      success: true,
      message: "Gemini API is working correctly!",
      testResult: {
        model: "gemini-2.0-flash-exp",
        explanation: explanation,
      },
    });
  } catch (error) {
    console.error("Gemini test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to connect to Gemini API. Check your API key in .env file.",
      },
      { status: 500 }
    );
  }
}

