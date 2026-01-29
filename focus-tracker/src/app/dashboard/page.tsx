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
      <div className="space-y-6 md:space-y-8 animate-fade-in-up">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)]">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted)] mt-1 md:mt-2">
              Track your daily progress and stay motivated
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-light)] flex items-center space-x-1 transition-colors"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-[var(--muted)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: {currentTime}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8 md:py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-4 text-sm md:text-base text-[var(--muted)]">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-xl p-4 md:p-6 text-center">
            <p className="text-[var(--danger)] text-sm md:text-base">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-[var(--danger)] text-white rounded-lg hover:opacity-90 text-sm md:text-base transition-opacity"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && data && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
              <div className="card-theme p-6 md:p-8 text-center py-8 md:py-12 rounded-xl">
                <div className="text-5xl md:text-6xl mb-4">📝</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-[var(--foreground)]">No habits yet!</h3>
                <p className="text-sm md:text-base text-[var(--muted)] mb-6">
                  Start building better habits by creating your first one.
                </p>
                <a
                  href="/habits"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg text-sm md:text-base"
                >
                  Create Your First Habit
                </a>
              </div>
            )}

            {/* Main Content Grid */}
            {data.totalHabits > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Today's Progress */}
                <div className="lg:col-span-2 card-theme p-4 md:p-6 rounded-xl">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center text-[var(--foreground)]">
                    <span className="mr-2">📋</span> Today&apos;s Habits
                  </h2>
                  
                  {/* Progress Bar */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--muted)]">Daily Progress</span>
                      <span className="font-semibold text-[var(--foreground)]">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 md:h-3 bg-[var(--charcoal-light)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
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
                            ? "bg-emerald-500/10 border border-emerald-500/30" 
                            : "bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50"
                        } ${toggling === habit.habitId ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            habit.completed
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-gray-700 text-gray-400"
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
                              habit.completed ? "text-emerald-400 line-through" : ""
                            }`}>
                              {habit.title}
                            </span>
                            {habit.description && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs md:text-sm font-medium ${
                          habit.completed 
                            ? "text-[var(--success)]" 
                            : "text-[var(--muted)]"
                        }`}>
                          {habit.completed ? "✓ Done" : "Click to complete"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Overview */}
                <div className="card-theme p-4 md:p-6 rounded-xl">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center text-[var(--foreground)]">
                    <span className="mr-2">📊</span> This Week
                  </h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    {data.weeklyProgress.map((day, index) => (
                      <div key={index} className="flex items-center space-x-2 md:space-x-3">
                        <span className="w-8 md:w-10 text-xs md:text-sm font-medium text-[var(--muted)]">{day.day}</span>
                        <div className="flex-1 h-1.5 md:h-2 bg-[var(--charcoal-light)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              day.total > 0 && day.completed === day.total 
                                ? "bg-gradient-to-r from-[var(--success)] to-emerald-400" 
                                : "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                            }`}
                            style={{ width: day.total > 0 ? `${(day.completed / day.total) * 100}%` : '0%' }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-[var(--muted)] w-10 md:w-12 text-right">
                          {day.completed}/{day.total}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[var(--card-border)]">
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold gradient-text">
                        {data.weeklyCompleted}/{data.weeklyTotal}
                      </div>
                      <div className="text-xs md:text-sm text-[var(--muted)]">
                        Habits completed this week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Motivational Quote */}
            <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <p className="text-base md:text-lg italic text-[var(--foreground-muted)]">
                &ldquo;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&rdquo;
              </p>
              <p className="text-xs md:text-sm text-[var(--muted)] mt-2">— Aristotle</p>
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
    green: "from-emerald-400 to-green-500",
    blue: "from-[var(--primary)] to-blue-500",
    orange: "from-amber-400 to-orange-500",
    purple: "from-[var(--secondary)] to-purple-500",
  };

  return (
    <div className="card-theme p-4 md:p-6 rounded-xl hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs md:text-sm text-[var(--muted)] mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">{value}</p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-xl md:text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] mt-2 md:mt-3">{trend}</p>
    </div>
  );
}
