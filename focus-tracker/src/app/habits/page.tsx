"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui";

interface HabitLog {
  id: number;
  date: string;
  completed: boolean;
}

interface Habit {
  id: number;
  title: string;
  description: string | null;
  frequency: string;
  isActive: boolean;
  createdAt: string;
  logs: HabitLog[];
}

export default function HabitsPage() {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();
  const deleteDialog = useConfirmDialog();
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "", frequency: "DAILY" });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/habits?userId=${user.id}`);
      const result = await response.json();

      if (result.success) {
        setHabits(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newHabit.title.trim() || creating) return;

    setCreating(true);
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newHabit.title,
          description: newHabit.description,
          frequency: newHabit.frequency,
          userId: user.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowCreateModal(false);
        setNewHabit({ title: "", description: "", frequency: "DAILY" });
        success("Habit Created!", `"${newHabit.title}" has been added to your habits.`);
        await fetchHabits();
      } else {
        showError("Creation Failed", result.message || "Failed to create habit.");
      }
    } catch (err) {
      console.error("Failed to create habit:", err);
      showError("Error", "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const deleteHabit = async (habitId: number) => {
    if (deleting) return;

    setDeleting(habitId);
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        success("Habit Deleted!", `"${habitToDelete?.title}" has been removed.`);
        await fetchHabits();
      } else {
        showError("Deletion Failed", result.message || "Failed to delete habit.");
      }
    } catch (err) {
      console.error("Failed to delete habit:", err);
      showError("Error", "Something went wrong. Please try again.");
    } finally {
      setDeleting(null);
      setHabitToDelete(null);
      deleteDialog.closeDialog();
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (habit: Habit) => {
    setHabitToDelete(habit);
    deleteDialog.openDialog();
  };

  // Calculate streaks for each habit
  const calculateStreak = (logs: HabitLog[]) => {
    if (!logs.length) return 0;
    
    const sortedLogs = [...logs]
      .filter(log => log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (!sortedLogs.length) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletedCount = (logs: HabitLog[]) => {
    return logs.filter(log => log.completed).length;
  };

  // Category icons based on habit title
  const getHabitIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes("exercise") || lowercaseTitle.includes("workout") || lowercaseTitle.includes("gym")) return "🏋️";
    if (lowercaseTitle.includes("read")) return "📚";
    if (lowercaseTitle.includes("code") || lowercaseTitle.includes("program")) return "💻";
    if (lowercaseTitle.includes("meditat")) return "🧘";
    if (lowercaseTitle.includes("water") || lowercaseTitle.includes("drink")) return "💧";
    if (lowercaseTitle.includes("journal") || lowercaseTitle.includes("write")) return "✍️";
    if (lowercaseTitle.includes("sleep") || lowercaseTitle.includes("bed")) return "😴";
    if (lowercaseTitle.includes("walk") || lowercaseTitle.includes("run")) return "🏃";
    if (lowercaseTitle.includes("eat") || lowercaseTitle.includes("diet") || lowercaseTitle.includes("healthy")) return "🥗";
    if (lowercaseTitle.includes("study") || lowercaseTitle.includes("learn")) return "📖";
    return "🎯";
  };

  const categories = [
    { name: "Health", color: "from-emerald-400 to-green-500", icon: "💪" },
    { name: "Learning", color: "from-cyan-400 to-blue-500", icon: "🎓" },
    { name: "Skills", color: "from-fuchsia-400 to-purple-500", icon: "⚡" },
    { name: "Wellness", color: "from-amber-400 to-yellow-500", icon: "🌟" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Habits", href: "/habits" },
  ];

  return (
    <ProtectedRoute>
    <div className="space-y-8 animate-fade-in-up">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Habits</h1>
          <p className="text-gray-400 mt-1">
            Create and manage your personal habits
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div 
            key={index}
            className="stat-card hover-lift cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              {category.icon}
            </div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-400">Category</p>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your habits...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && habits.length === 0 && (
        <div className="stat-card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No habits yet!</h3>
          <p className="text-gray-400 mb-6">
            Start building better habits by creating your first one.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
          >
            Create Your First Habit
          </button>
        </div>
      )}

      {/* Habits Grid */}
      {!loading && habits.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🎯</span> Your Habits ({habits.length})
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit, index) => (
              <div 
                key={habit.id}
                className="stat-card hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {getHabitIcon(habit.title)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="badge badge-primary">{habit.frequency}</span>
                    <button
                      onClick={() => openDeleteDialog(habit)}
                      disabled={deleting === habit.id}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete habit"
                    >
                      {deleting === habit.id ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{habit.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {habit.description || "No description"}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-1">
                    <span className="text-orange-500">🔥</span>
                    <span className="text-sm font-medium">{calculateStreak(habit.logs)} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{getCompletedCount(habit.logs)} completions</span>
                  </div>
                </div>

                <a 
                  href="/dashboard"
                  className="block w-full mt-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-colors text-center border border-cyan-500/30"
                >
                  Track Today
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">💡</span> Tips for Building Habits
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <TipCard 
            number="01"
            title="Start Small"
            description="Begin with 2-minute habits and gradually increase the difficulty."
          />
          <TipCard 
            number="02"
            title="Stack Habits"
            description="Attach new habits to existing routines for better consistency."
          />
          <TipCard 
            number="03"
            title="Track Progress"
            description="Visual progress tracking increases motivation and accountability."
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-400">
          {habits.length} habit{habits.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {/* Create Habit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Habit</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={createHabit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Habit Name *</label>
                <input
                  type="text"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  placeholder="e.g., Morning Meditation"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="e.g., 10 minutes of mindfulness every morning"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-700 font-medium hover:bg-gray-800 transition-colors text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newHabit.title.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                >
                  {creating ? "Creating..." : "Create Habit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => {
          deleteDialog.closeDialog();
          setHabitToDelete(null);
        }}
        onConfirm={async () => {
          if (habitToDelete) {
            await deleteHabit(habitToDelete.id);
          }
        }}
        title="Delete Habit?"
        message={`Are you sure you want to delete "${habitToDelete?.title}"? This will remove all associated habit logs and cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting === habitToDelete?.id}
      />
    </div>
    </ProtectedRoute>
  );
}

function TipCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/30">
        {number}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}
