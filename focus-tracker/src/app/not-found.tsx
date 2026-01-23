import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-extrabold gradient-text opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🔍</div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Suggested Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="btn-primary px-8 py-3 w-full sm:w-auto"
          >
            ← Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary px-8 py-3 w-full sm:w-auto"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Quick Links */}
        <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
          <h2 className="font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/habits"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center space-x-2"
            >
              <span>🎯</span>
              <span>Habits</span>
            </Link>
            <Link
              href="/users"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center space-x-2"
            >
              <span>👥</span>
              <span>Users</span>
            </Link>
          </div>
        </div>

        {/* Technical Info */}
        <p className="text-xs text-gray-400 mt-8">
          Error Code: 404 | Route Not Found
        </p>
      </div>
    </div>
  );
}
