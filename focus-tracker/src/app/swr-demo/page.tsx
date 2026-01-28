"use client";

import { useState } from "react";
import { useHabits, useHabitMutations, useCacheDebug, useNotification } from "@/hooks";
import type { CreateHabitInput, Habit } from "@/hooks";

/**
 * SWR Demo Page
 * 
 * Demonstrates client-side data fetching with SWR:
 * - Automatic caching and revalidation
 * - Optimistic UI updates
 * - Cache inspection
 * - Error handling
 */
export default function SWRDemoPage() {
  const { habits, isLoading, isValidating, error, refresh } = useHabits();
  const { createHabit, deleteHabit, toggleComplete } = useHabitMutations();
  const { logCache, getCacheKeys } = useCacheDebug();
  const { success, error: showError, info } = useNotification();

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState("daily");
  const [isCreating, setIsCreating] = useState(false);
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);

  // Handle create habit
  const handleCreateHabit = async () => {
    if (!newHabitTitle.trim()) {
      showError("Validation Error", "Please enter a habit title");
      return;
    }

    setIsCreating(true);
    try {
      const input: CreateHabitInput = {
        title: newHabitTitle,
        frequency: newHabitFrequency,
        description: `Created via SWR demo at ${new Date().toLocaleTimeString()}`,
      };

      await createHabit(input);
      success("Habit Created!", `"${newHabitTitle}" was added with optimistic update`);
      setNewHabitTitle("");
    } catch (err) {
      showError("Failed to Create", "The habit could not be created. Check console for details.");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle toggle complete
  const handleToggleComplete = async (habit: Habit) => {
    try {
      await toggleComplete(habit.id);
      info(
        habit.completedToday ? "Marked Incomplete" : "Completed!",
        `"${habit.title}" status updated optimistically`
      );
    } catch (err) {
      showError("Update Failed", "Could not toggle habit completion");
    }
  };

  // Handle delete
  const handleDelete = async (habit: Habit) => {
    if (!confirm(`Delete "${habit.title}"?`)) return;

    try {
      await deleteHabit(habit.id);
      success("Deleted", `"${habit.title}" was removed`);
    } catch (err) {
      showError("Delete Failed", "Could not delete the habit");
    }
  };

  // Inspect cache
  const handleInspectCache = () => {
    const keys = getCacheKeys();
    setCacheKeys(keys);
    logCache();
    info("Cache Inspected", `Found ${keys.length} cached entries. Check console for details.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">SWR Data Fetching Demo</h1>
        <p className="text-gray-400">
          Client-side data fetching with caching, revalidation, and optimistic updates
        </p>
      </div>

      {/* Status Bar */}
      <div className="card card-dark p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Status:</span>
              {isLoading ? (
                <span className="badge badge-warning">Loading...</span>
              ) : isValidating ? (
                <span className="badge badge-info">Revalidating...</span>
              ) : error ? (
                <span className="badge badge-error">Error</span>
              ) : (
                <span className="badge badge-success">Ready</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {habits.length} habits loaded
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                refresh();
                info("Refreshing", "Manually revalidating data...");
              }}
              disabled={isValidating}
              className="btn-outline-primary text-sm"
            >
              {isValidating ? "Refreshing..." : "🔄 Refresh"}
            </button>
            <button
              onClick={handleInspectCache}
              className="btn-outline-primary text-sm"
            >
              🗃️ Inspect Cache
            </button>
          </div>
        </div>
      </div>

      {/* Create Habit Form */}
      <div className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Create New Habit (Optimistic Update)
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Enter habit title..."
            className="input-field flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
          />
          <select
            value={newHabitFrequency}
            onChange={(e) => setNewHabitFrequency(e.target.value)}
            className="input-field sm:w-40"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={handleCreateHabit}
            disabled={isCreating || !newHabitTitle.trim()}
            className="btn-primary"
          >
            {isCreating ? "Creating..." : "Add Habit"}
          </button>
        </div>
        
        <p className="mt-3 text-sm text-gray-500">
          💡 <strong>Optimistic UI:</strong> The habit appears immediately in the list before the API responds.
        </p>
      </div>

      {/* Habits List */}
      <div className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          Habits List (SWR Cached)
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-400">Loading habits...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">Failed to load habits</p>
            <p className="text-gray-500 text-sm mt-1">Please check your connection and try again</p>
            <button onClick={refresh} className="btn-primary mt-4">
              Retry
            </button>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-400">No habits yet</p>
            <p className="text-gray-500 text-sm mt-1">Create your first habit above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit: Habit) => (
              <div
                key={habit.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg border transition-all
                  ${habit.completedToday
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Complete Toggle */}
                  <button
                    onClick={() => handleToggleComplete(habit)}
                    className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                      ${habit.completedToday
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-gray-600 hover:border-cyan-400"
                      }
                    `}
                  >
                    {habit.completedToday && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Habit Info */}
                  <div>
                    <h3 className={`font-medium ${habit.completedToday ? "text-emerald-400" : "text-white"}`}>
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="badge badge-info text-xs">{habit.frequency}</span>
                      <span>🔥 {habit.currentStreak} streak</span>
                      {habit.description && (
                        <span className="hidden sm:inline">• {habit.description}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(habit)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Delete habit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Background Revalidation Indicator */}
        {isValidating && !isLoading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-cyan-400">
            <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Revalidating in background...
          </div>
        )}
      </div>

      {/* Cache Debug Panel */}
      <div className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </span>
          SWR Cache Debug
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Cached Keys:</h3>
            {cacheKeys.length > 0 ? (
              <ul className="space-y-1">
                {cacheKeys.map((key) => (
                  <li key={key} className="text-sm text-gray-300 font-mono">
                    📦 {key}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Click "Inspect Cache" to view cached keys</p>
            )}
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">SWR Concepts:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <div>
                  <strong className="text-white">Cache Hit</strong>
                  <p className="text-gray-500">Data served instantly from cache</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">⟳</span>
                <div>
                  <strong className="text-white">Revalidation</strong>
                  <p className="text-gray-500">Fresh data fetched in background</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400">⚡</span>
                <div>
                  <strong className="text-white">Optimistic Update</strong>
                  <p className="text-gray-500">UI updates before API response</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-fuchsia-400">↩</span>
                <div>
                  <strong className="text-white">Rollback</strong>
                  <p className="text-gray-500">Reverts on API failure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Usage Example</h2>
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300">
{`import { useHabits, useHabitMutations } from '@/hooks';

function MyComponent() {
  // Fetch habits with SWR (cached + auto-revalidate)
  const { habits, isLoading, refresh } = useHabits();
  
  // Get mutation functions with optimistic updates
  const { createHabit, toggleComplete, deleteHabit } = useHabitMutations();
  
  // Create with optimistic UI
  const handleCreate = async () => {
    await createHabit({ title: 'Exercise', frequency: 'daily' });
    // UI updates instantly, then syncs with server
  };
  
  // Toggle completion
  const handleToggle = async (id) => {
    await toggleComplete(id);
    // Checkbox updates immediately
  };
  
  return (
    <ul>
      {habits.map(habit => (
        <li key={habit.id} onClick={() => handleToggle(habit.id)}>
          {habit.title}
        </li>
      ))}
    </ul>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
