import Link from "next/link";
import { prisma } from "@/lib/db";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const mockUserId = "john.doe@example.com";
  const user = await prisma.user.findUnique({
    where: { email: mockUserId },
  });
  const userName = user?.name || "Student";
  const initials = getInitials(userName);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            🎓 Admission Copilot
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/dashboard"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/programs"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Programs
          </Link>
          <Link
            href="/tasks"
            className="block rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
          >
            Tasks
          </Link>
          <Link
            href="/profile"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search programs..."
              className="w-64 rounded-lg border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">{userName}</span>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-center leading-8 text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

