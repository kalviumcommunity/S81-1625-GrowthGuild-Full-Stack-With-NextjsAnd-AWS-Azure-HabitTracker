"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function HabitsPage() {
  const habits = [
    { name: "Exercise", icon: "🏋️", category: "Health", description: "30 minutes of physical activity", streak: 12, completed: 156 },
    { name: "Read 20 minutes", icon: "📚", category: "Learning", description: "Read books or articles daily", streak: 8, completed: 89 },
    { name: "Code daily", icon: "💻", category: "Skills", description: "Practice coding for at least 1 hour", streak: 15, completed: 203 },
    { name: "Meditate", icon: "🧘", category: "Wellness", description: "10 minutes of mindfulness", streak: 5, completed: 67 },
    { name: "Drink Water", icon: "💧", category: "Health", description: "8 glasses of water daily", streak: 20, completed: 245 },
    { name: "Journal", icon: "✍️", category: "Wellness", description: "Write daily reflections", streak: 3, completed: 42 },
  ];

  const categories = [
    { name: "Health", count: 2, color: "from-green-400 to-emerald-500", icon: "💪" },
    { name: "Learning", count: 1, color: "from-blue-400 to-cyan-500", icon: "🎓" },
    { name: "Skills", count: 1, color: "from-purple-400 to-indigo-500", icon: "⚡" },
    { name: "Wellness", count: 2, color: "from-orange-400 to-amber-500", icon: "🌟" },
  ];

  return (
    <ProtectedRoute>
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Habit Library</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Discover and track popular habits to build your routine
          </p>
        </div>
        <button className="btn-primary flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Custom Habit</span>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} habits</p>
          </div>
        ))}
      </div>

      {/* Habits Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🎯</span> Popular Habits
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit, index) => (
            <div 
              key={index}
              className="stat-card hover-lift group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/50 dark:to-cyan-900/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {habit.icon}
                </div>
                <span className="badge badge-primary">{habit.category}</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{habit.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {habit.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500">🔥</span>
                  <span className="text-sm font-medium">{habit.streak} day streak</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{habit.completed}</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                Start Tracking
              </button>
            </div>
          ))}
        </div>
      </div>

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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {habits.length} habits available
        </p>
      </div>
    </div>
    </ProtectedRoute>
  );
}

function TipCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
