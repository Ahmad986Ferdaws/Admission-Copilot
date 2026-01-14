import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-blue-600">🎓 Admission Copilot</h1>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-5xl font-bold text-gray-900">
          Find Your Perfect University Program
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          AI-powered program matching, application tracking, and personalized guidance
          for your university admission journey.
        </p>
        <Link
          href="/register"
          className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
        >
          Start Matching Programs →
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Everything You Need to Apply
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">🎯</div>
            <h4 className="mb-2 text-xl font-semibold">Smart Matching</h4>
            <p className="text-gray-600">
              Get matched with programs that fit your profile, budget, and goals.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">📋</div>
            <h4 className="mb-2 text-xl font-semibold">Document Checklists</h4>
            <p className="text-gray-600">
              Never miss a document with program-specific checklists.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">✉️</div>
            <h4 className="mb-2 text-xl font-semibold">Email Templates</h4>
            <p className="text-gray-600">
              Generate personalized emails for scholarships and inquiries.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">📊</div>
            <h4 className="mb-2 text-xl font-semibold">Progress Tracking</h4>
            <p className="text-gray-600">
              Track your application tasks and deadlines in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Admission Copilot. Your AI-powered admission assistant.</p>
        </div>
      </footer>
    </div>
  );
}
