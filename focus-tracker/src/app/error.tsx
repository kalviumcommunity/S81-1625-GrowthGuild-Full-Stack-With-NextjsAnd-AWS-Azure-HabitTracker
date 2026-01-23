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
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center animate-fade-in-up max-w-lg mx-auto">
        {/* Error Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl">⚠️</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We encountered an unexpected error. Don&apos;t worry, our team has been notified.
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
              Error Details:
            </h3>
            <code className="text-xs text-red-500 break-all">
              {error.message}
            </code>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={reset}
            className="btn-primary px-8 py-3 w-full sm:w-auto"
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary px-8 py-3 w-full sm:w-auto"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-3">Need Help?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If this error persists, try these steps:
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 text-left space-y-2">
            <li className="flex items-start space-x-2">
              <span>1.</span>
              <span>Refresh the page</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>2.</span>
              <span>Clear your browser cache</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>3.</span>
              <span>Try logging out and back in</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>4.</span>
              <span>Contact support if the issue continues</span>
            </li>
          </ul>
        </div>

        {/* Technical Info */}
        <p className="text-xs text-gray-400 mt-8">
          Error Code: 500 | Internal Application Error
        </p>
      </div>
    </div>
  );
}
