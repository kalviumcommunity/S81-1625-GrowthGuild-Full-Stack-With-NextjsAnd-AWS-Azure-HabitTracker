"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Breadcrumbs from "@/components/Breadcrumbs";
import { use } from "react";
import { fetchWithOptions } from "@/lib/fetcher";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

interface Habit {
  id: number;
  title: string;
  description: string | null;
  frequency: string;
  createdAt: string;
}

interface UserProfileProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: UserProfileProps) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const shouldSimulateDelay =
          typeof window !== "undefined" &&
          new URLSearchParams(window.location.search).get("demoSlow") === "1";

        if (shouldSimulateDelay) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Fetch user details
        let userData;
        try {
          userData = await fetchWithOptions<{ success: boolean; data: User; message?: string }>(`/api/users/${id}`);
        } catch (requestError: any) {
          if (requestError?.status === 404) {
            setError("User not found");
            setLoading(false);
            return;
          }

          throw new Error("Failed to fetch user");
        }
        
        if (userData.success) {
          setUser(userData.data);
        } else {
          setError(userData.message || "Failed to fetch user");
        }

        // Fetch user's habits
        const habitsData = await fetchWithOptions<{ success: boolean; data: Habit[] }>(
          `/api/habits?userId=${id}`
        );
        if (habitsData.success) {
          setHabits(habitsData.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Users", href: "/users" },
    { label: user?.name || `User ${id}`, href: `/users/${id}` },
  ];

  if (!loading && error) {
    throw new Error(error);
  }

  // Get habit icon based on title
  const getHabitIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes("exercise") || lowercaseTitle.includes("workout")) return "🏋️";
    if (lowercaseTitle.includes("read")) return "📚";
    if (lowercaseTitle.includes("code") || lowercaseTitle.includes("program")) return "💻";
    if (lowercaseTitle.includes("meditat")) return "🧘";
    if (lowercaseTitle.includes("water")) return "💧";
    if (lowercaseTitle.includes("journal")) return "✍️";
    return "🎯";
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-fade-in-up">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading user profile...</p>
            </div>
          </div>
        )}

        {/* User Profile */}
        {!loading && !error && user && (
          <>
            {/* Profile Header */}
            <div className="stat-card">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">
                      {user.name || "Unnamed User"}
                    </h1>
                    <span className={`badge ${user.role === "admin" ? "badge-warning" : "badge-primary"}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-3">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      User ID: {user.id}
                    </span>
                  </div>
                </div>

                <Link
                  href="/users"
                  className="btn-secondary self-start"
                >
                  ← Back to Users
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="stat-card hover-lift">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Habits</p>
                    <p className="text-3xl font-bold">{habits.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                    🎯
                  </div>
                </div>
              </div>

              <div className="stat-card hover-lift">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Age</p>
                    <p className="text-3xl font-bold">
                      {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl shadow-lg">
                    📅
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">days</p>
              </div>

              <div className="stat-card hover-lift">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                    <p className="text-3xl font-bold capitalize">{user.role}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-2xl shadow-lg">
                    👤
                  </div>
                </div>
              </div>
            </div>

            {/* User's Habits */}
            <div className="stat-card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <span className="mr-2">📋</span> User&apos;s Habits
              </h2>

              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    This user hasn&apos;t created any habits yet.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/50 dark:to-cyan-900/50 flex items-center justify-center text-xl">
                          {getHabitIcon(habit.title)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{habit.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {habit.description || "No description"}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="badge badge-primary text-xs">{habit.frequency}</span>
                            <span className="text-xs text-gray-400">
                              Created {new Date(habit.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Route Info */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">🛣️</span> Dynamic Route Info
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  This page uses <strong>dynamic routing</strong> with the pattern{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/users/[id]</code>
                </p>
                <p>
                  Current route: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/users/{id}</code>
                </p>
                <p>
                  The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">id</code> parameter is extracted from the URL 
                  and used to fetch user-specific data from the API.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
