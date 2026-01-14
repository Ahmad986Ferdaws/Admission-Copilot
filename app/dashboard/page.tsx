import { prisma } from "@/lib/db";
import { getMatchStats } from "@/lib/matching/algorithm";
import Link from "next/link";
import { redirect } from "next/navigation";
import CopilotChat from "@/components/chat/copilot-chat";

export default async function DashboardPage() {
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

  // Get match statistics
  const stats = await getMatchStats(user.id);

  // Get top matches for display
  const topMatches = await prisma.match.findMany({
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
    take: 10,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your application journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600">Total Matches</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-green-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-green-600">Safe Programs</div>
          <div className="mt-2 text-3xl font-bold text-green-700">{stats.safe}</div>
        </div>
        <div className="rounded-lg border bg-yellow-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-yellow-600">Match Programs</div>
          <div className="mt-2 text-3xl font-bold text-yellow-700">{stats.match}</div>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-red-600">Reach Programs</div>
          <div className="mt-2 text-3xl font-bold text-red-700">{stats.reach}</div>
        </div>
      </div>

      {/* No matches message */}
      {stats.total === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="font-semibold text-yellow-900">No matches found</h3>
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
      )}

      {/* Main Content Area */}
      {stats.total > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Matches Table */}
          <div className="rounded-lg border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Top Matches</h2>
              <Link
                href="/programs"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs uppercase text-gray-600">
                  <tr>
                    <th className="pb-3">Program</th>
                    <th className="pb-3">University</th>
                    <th className="pb-3">Country</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3">Fit Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium">
                        <Link
                          href={`/programs/${match.programId}`}
                          className="hover:text-blue-600"
                        >
                          {match.program.name}
                        </Link>
                      </td>
                      <td className="py-3">{match.program.university.name}</td>
                      <td className="py-3">{match.program.university.country}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            match.tier === "SAFE"
                              ? "bg-green-100 text-green-700"
                              : match.tier === "MATCH"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {match.tier}
                        </span>
                      </td>
                      <td className="py-3">{match.fitScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex h-[500px] flex-col rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">AI Copilot</h2>
            <CopilotChat userName={user.name || "there"} matchCount={stats.total} />
          </div>
        </div>
      )}
    </div>
  );
}

