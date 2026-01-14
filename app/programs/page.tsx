import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProgramsPage() {
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

  // Get all matches for the user
  const matches = await prisma.match.findMany({
    where: { userId: user.id },
    include: {
      program: {
        include: {
          university: true,
        },
      },
    },
    orderBy: {
      fitScore: "desc",
    },
  });
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <p className="mt-2 text-gray-600">Browse all matched programs</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Refine Matches
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 rounded-lg border bg-white p-4">
        <select className="rounded-lg border px-4 py-2 text-sm">
          <option>All Countries</option>
          <option>USA</option>
          <option>Canada</option>
          <option>UK</option>
        </select>
        <select className="rounded-lg border px-4 py-2 text-sm">
          <option>All Tiers</option>
          <option>Safe</option>
          <option>Match</option>
          <option>Reach</option>
        </select>
        <select className="rounded-lg border px-4 py-2 text-sm">
          <option>All Budgets</option>
          <option>&lt; $20k/year</option>
          <option>$20k - $40k/year</option>
          <option>&gt; $40k/year</option>
        </select>
      </div>

      {/* Programs Grid */}
      {matches.length === 0 ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-yellow-900">No matches found</h3>
          <p className="mt-2 text-sm text-yellow-800">
            We couldn't find any programs matching your criteria. Try adjusting your
            profile or budget preferences.
          </p>
          <Link
            href="/profile"
            className="mt-4 inline-block rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
          >
            Update Profile
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => {
            const tierColor =
              match.tier === "SAFE"
                ? "bg-green-100 text-green-700"
                : match.tier === "MATCH"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700";
            const fitColor =
              match.tier === "SAFE"
                ? "text-green-600"
                : match.tier === "MATCH"
                ? "text-yellow-600"
                : "text-red-600";

            return (
              <Link
                key={match.id}
                href={`/programs/${match.programId}`}
                className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {match.program.name}
                  </h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${tierColor}`}>
                    {match.tier}
                  </span>
                </div>
                <p className="mb-2 font-medium text-gray-700">
                  {match.program.university.name}
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  {match.program.university.city}, {match.program.university.country}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tuition:</span>
                    <span className="font-medium">
                      ${match.program.tuitionPerYear.toLocaleString()}/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">
                      {match.program.deadline
                        ? new Date(match.program.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fit Score:</span>
                    <span className={`font-medium ${fitColor}`}>{match.fitScore}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

