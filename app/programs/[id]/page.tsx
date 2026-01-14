import { prisma } from "@/lib/db";
import { generateProgramExplanation, generateChecklist } from "@/lib/llm/gemini";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { autoGenerateTasksForProgram } from "@/app/actions/tasks";

async function GenerateTasksButton({ programId }: { programId: string }) {
  async function handleGenerateTasks() {
    "use server";
    const result = await autoGenerateTasksForProgram(programId);
    if (result.success) {
      revalidatePath("/tasks");
      redirect("/tasks");
    }
  }

  return (
    <form action={handleGenerateTasks}>
      <button
        type="submit"
        className="rounded-lg border px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
      >
        Generate Tasks
      </button>
    </form>
  );
}

export default async function ProgramDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await params in Next.js 15+
  const { id } = await params;
  
  // For v1, using mock user
  const mockUserId = "john.doe@example.com";
  
  const user = await prisma.user.findUnique({
    where: { email: mockUserId },
    include: { profile: true },
  });

  // If no profile, redirect to profile page
  if (!user || !user.profile) {
    redirect("/profile");
  }

  // Get the match for this program
  const match = await prisma.match.findUnique({
    where: {
      userId_programId: {
        userId: user.id,
        programId: id,
      },
    },
    include: {
      program: {
        include: {
          university: true,
        },
      },
    },
  });

  if (!match) {
    notFound();
  }

  // Generate AI explanation (with fallback)
  let explanation = "";
  try {
    explanation = await generateProgramExplanation({
      profile: user.profile,
      program: match.program,
      match: {
        fitScore: match.fitScore,
        tier: match.tier,
      },
    });
  } catch (error) {
    console.error("Failed to generate explanation:", error);
    explanation = "AI explanation temporarily unavailable. This is a good program match based on your profile. The tuition fits your budget, and your academic credentials meet the requirements.";
  }

  // Generate document checklist (with fallback)
  let checklist: string[] = [];
  try {
    checklist = await generateChecklist({
      profile: user.profile,
      program: match.program,
    });
  } catch (error) {
    console.error("Failed to generate checklist:", error);
    checklist = [
      "Statement of Purpose",
      "Official Transcripts",
      "Letters of Recommendation (2-3)",
      "English Test Scores (IELTS/TOEFL)",
      "Resume/CV",
      "Financial Documents",
      "Passport Copy",
    ];
  }

  const tierColor =
    match.tier === "SAFE"
      ? "bg-green-100 text-green-700"
      : match.tier === "MATCH"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-600">
        <Link href="/programs" className="hover:text-gray-900">
          Programs
        </Link>{" "}
        / {match.program.name}
      </div>

      {/* Program Header */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{match.program.name}</h1>
            <p className="mt-2 text-xl text-gray-700">{match.program.university.name}</p>
            <p className="mt-1 text-gray-600">
              {match.program.university.city}, {match.program.university.country}
            </p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-medium ${tierColor}`}>
            {match.tier} - {match.fitScore}% Fit
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm text-gray-600">Tuition</div>
            <div className="mt-1 text-lg font-semibold">
              ${match.program.tuitionPerYear.toLocaleString()}/year
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Degree Level</div>
            <div className="mt-1 text-lg font-semibold">{match.program.degreeLevel}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Application Deadline</div>
            <div className="mt-1 text-lg font-semibold">
              {match.program.deadline
                ? new Date(match.program.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Not specified"}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Requirements</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-600">Minimum GPA</div>
            <div className="mt-1 font-medium">
              {match.program.minGpa
                ? `${match.program.minGpa} / ${match.program.gpaScale}`
                : "Not specified"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">English Proficiency</div>
            <div className="mt-1 font-medium">
              {match.program.minEnglishScore && match.program.englishTestType
                ? `${match.program.englishTestType} ${match.program.minEnglishScore}`
                : "Not specified"}
            </div>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="rounded-lg border bg-blue-50 p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          🤖 Why is this a good fit?
        </h2>
        <div className="whitespace-pre-line text-gray-700">{explanation}</div>
      </div>

      {/* Document Checklist */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          📋 Required Documents
        </h2>
        <ul className="space-y-2">
          {checklist.map((doc, i) => (
            <li key={i} className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-gray-700">{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <GenerateTasksButton programId={match.programId} />
        <Link
          href="/tasks"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          View All Tasks
        </Link>
      </div>
    </div>
  );
}

