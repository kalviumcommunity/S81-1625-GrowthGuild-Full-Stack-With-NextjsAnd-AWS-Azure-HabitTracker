"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const data = {
    completedToday: 3,
    totalHabits: 5,
    time: new Date().toLocaleTimeString(),
  };

  const recentActivity = [
    { habit: "Morning Meditation", status: "completed", time: "7:30 AM" },
    { habit: "Exercise", status: "completed", time: "8:00 AM" },
    { habit: "Read 20 minutes", status: "completed", time: "9:15 AM" },
    { habit: "Code daily", status: "pending", time: "Pending" },
    { habit: "Evening Journal", status: "pending", time: "Pending" },
  ];

  const weeklyProgress = [
    { day: "Mon", completed: 4, total: 5 },
    { day: "Tue", completed: 5, total: 5 },
    { day: "Wed", completed: 3, total: 5 },
    { day: "Thu", completed: 5, total: 5 },
    { day: "Fri", completed: 4, total: 5 },
    { day: "Sat", completed: 2, total: 5 },
    { day: "Sun", completed: data.completedToday, total: data.totalHabits },
  ];

  const progressPercentage = Math.round((data.completedToday / data.totalHabits) * 100);

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-fade-in-up">
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
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Last updated: {data.time}</span>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="✅" 
          label="Completed Today" 
          value={data.completedToday.toString()} 
          trend="+2 from yesterday"
          color="green"
        />
        <StatCard 
          icon="🎯" 
          label="Total Habits" 
          value={data.totalHabits.toString()} 
          trend="5 active habits"
          color="blue"
        />
        <StatCard 
          icon="🔥" 
          label="Current Streak" 
          value="12" 
          trend="Personal best: 15"
          color="orange"
        />
        <StatCard 
          icon="📈" 
          label="Weekly Average" 
          value="85%" 
          trend="+5% this week"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
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

          {/* Activity List */}
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  activity.status === "completed" 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                    : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }`}>
                    {activity.status === "completed" ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium ${
                    activity.status === "completed" ? "text-green-700 dark:text-green-300" : ""
                  }`}>
                    {activity.habit}
                  </span>
                </div>
                <span className={`text-sm ${
                  activity.status === "completed" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-gray-500"
                }`}>
                  {activity.time}
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
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="w-10 text-sm font-medium text-gray-500">{day.day}</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      day.completed === day.total 
                        ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                        : "bg-gradient-to-r from-indigo-400 to-indigo-500"
                    }`}
                    style={{ width: `${(day.completed / day.total) * 100}%` }}
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
              <div className="text-2xl font-bold gradient-text">26/35</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Habits completed this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-lg italic text-gray-600 dark:text-gray-300">
          &ldquo;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&rdquo;
        </p>
        <p className="text-sm text-gray-500 mt-2">— Aristotle</p>
      </div>
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
