"use client";

import { useState } from "react";

interface DemoResult {
  success: boolean;
  before: string;
  after: {
    sanitizedPlain: string;
    sanitizedRich: string;
    encoded: string;
  };
  analysis: {
    containsScriptTag: boolean;
    hasSqliRisk: boolean;
  };
  note: string;
  message?: string;
}

export default function SecurityDemoPage() {
  const [payload, setPayload] = useState('<script>alert("Hacked!")</script> OR 1=1 --');
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/sanitize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        before: payload,
        after: { sanitizedPlain: "", sanitizedRich: "", encoded: "" },
        analysis: { containsScriptTag: false, hasSqliRisk: false },
        note: "",
        message: "Demo request failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">XSS and SQLi Sanitization Demo</h1>
        <p className="text-gray-500 dark:text-gray-400">
          This page demonstrates before and after behavior of the shared security utility.
        </p>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <label className="block text-sm font-medium">Untrusted Input</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
          />

          <button
            onClick={runDemo}
            disabled={loading}
            className="btn-primary px-5 py-2"
          >
            {loading ? "Processing..." : "Run Sanitization"}
          </button>
        </div>

        {result && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Result</h2>
            {!result.success && (
              <p className="text-red-500">{result.message || "Request failed"}</p>
            )}
            {result.success && (
              <>
                <div>
                  <p className="font-medium mb-1">Before</p>
                  <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{result.before}</pre>
                </div>

                <div>
                  <p className="font-medium mb-1">After (Plain Sanitized)</p>
                  <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{result.after.sanitizedPlain}</pre>
                </div>

                <div>
                  <p className="font-medium mb-1">After (Encoded Output)</p>
                  <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{result.after.encoded}</pre>
                </div>

                <div className="text-sm">
                  <p>Detected script tag: {result.analysis.containsScriptTag ? "Yes" : "No"}</p>
                  <p>Detected SQLi pattern: {result.analysis.hasSqliRisk ? "Yes" : "No"}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
