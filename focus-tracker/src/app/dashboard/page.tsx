"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";

interface TodayHabit {
  habitId: number;
  title: string;
  description: string | null;
  completed: boolean;
  logId: number | null;
}

interface WeeklyProgress {
  day: string;
  date: string;
  completed: number;
  total: number;
}

interface DashboardData {
  completedToday: number;
  totalHabits: number;
  currentStreak: number;
  weeklyAverage: number;
  weeklyCompleted: number;
  weeklyTotal: number;
  todayHabits: TodayHabit[];
  weeklyProgress: WeeklyProgress[];
  recentActivity: { habit: string; habitId: number; status: string; time: string }[];
  lastUpdated: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/dashboard/stats?userId=${user.id}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const toggleHabit = async (habitId: number) => {
    if (!user?.id || toggling) return;

    setToggling(habitId);
    try {
      const response = await fetch("/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, userId: user.id }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh dashboard data after toggle
        await fetchDashboardData();
      } else {
        console.error("Toggle failed:", result.message);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setToggling(null);
    }
  };

  const progressPercentage = data && data.totalHabits > 0 
    ? Math.round((data.completedToday / data.totalHabits) * 100) 
    : 0;

  const currentTime = new Date().toLocaleTimeString();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-fade-in-up">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track your daily progress and stay motivated
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center space-x-1"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: {currentTime}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && data && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon="✅" 
                label="Completed Today" 
                value={data.completedToday.toString()} 
                trend={`${data.totalHabits - data.completedToday} remaining`}
                color="green"
              />
              <StatCard 
                icon="🎯" 
                label="Total Habits" 
                value={data.totalHabits.toString()} 
                trend={`${data.totalHabits} active habits`}
                color="blue"
              />
              <StatCard 
                icon="🔥" 
                label="Current Streak" 
                value={data.currentStreak.toString()} 
                trend={data.currentStreak > 0 ? "Keep it up!" : "Start your streak today!"}
                color="orange"
              />
              <StatCard 
                icon="📈" 
                label="Weekly Average" 
                value={`${data.weeklyAverage}%`} 
                trend={`${data.weeklyCompleted}/${data.weeklyTotal} this week`}
                color="purple"
              />
            </div>

            {/* Empty State */}
            {data.totalHabits === 0 && (
              <div className="stat-card text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No habits yet!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start building better habits by creating your first one.
                </p>
                <a
                  href="/habits"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Create Your First Habit
                </a>
              </div>
            )}

            {/* Main Content Grid */}
            {data.totalHabits > 0 && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Today's Progress */}
                <div className="lg:col-span-2 stat-card">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="mr-2">📋</span> Today&apos;s Habits
                  </h2>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
                      <span className="font-semibold">{progressPercentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Habits List */}
                  <div className="space-y-3">
                    {data.todayHabits.map((habit) => (
                      <div 
                        key={habit.habitId}
                        onClick={() => toggleHabit(habit.habitId)}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer hover:scale-[1.01] ${
                          habit.completed 
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                            : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                        } ${toggling === habit.habitId ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            habit.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                          }`}>
                            {toggling === habit.habitId ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : habit.completed ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <span className={`font-medium ${
                              habit.completed ? "text-green-700 dark:text-green-300 line-through" : ""
                            }`}>
                              {habit.title}
                            </span>
                            {habit.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          habit.completed 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-gray-500"
                        }`}>
                          {habit.completed ? "✓ Done" : "Click to complete"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Overview */}
                <div className="stat-card">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="mr-2">📊</span> This Week
                  </h2>
                  
                  <div className="space-y-4">
                    {data.weeklyProgress.map((day, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="w-10 text-sm font-medium text-gray-500">{day.day}</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              day.total > 0 && day.completed === day.total 
                                ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                                : "bg-gradient-to-r from-indigo-400 to-indigo-500"
                            }`}
                            style={{ width: day.total > 0 ? `${(day.completed / day.total) * 100}%` : '0%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                          {day.completed}/{day.total}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {data.weeklyCompleted}/{data.weeklyTotal}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Habits completed this week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Motivational Quote */}
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-lg italic text-gray-600 dark:text-gray-300">
                &ldquo;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-2">— Aristotle</p>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ icon, label, value, trend, color }: {
  icon: string;
  label: string;
  value: string;
  trend: string;
  color: "green" | "blue" | "orange" | "purple";
}) {
  const colorClasses = {
    green: "from-green-400 to-emerald-500",
    blue: "from-blue-400 to-cyan-500",
    orange: "from-orange-400 to-amber-500",
    purple: "from-purple-400 to-indigo-500",
  };

  return (
    <div className="stat-card hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{trend}</p>
    </div>
  );
}
