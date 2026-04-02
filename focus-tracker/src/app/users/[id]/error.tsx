"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("User profile route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 p-6 sm:p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">User Profile</p>
        <h2 className="mt-2 text-2xl font-bold">Unable to load this profile</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The request failed. Please retry or return to the users list.
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className="mt-3 text-xs text-red-500 break-all">{error.message}</p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary px-6 py-3">
            Try Again
          </button>
          <Link href="/users" className="btn-secondary px-6 py-3">
            Back to Users
          </Link>
        </div>
      </div>
    </div>
  );
}
