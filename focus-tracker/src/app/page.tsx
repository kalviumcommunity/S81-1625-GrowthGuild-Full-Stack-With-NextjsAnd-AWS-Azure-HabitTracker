import { transactionDemo } from "@/lib/transactions";
import Link from "next/link";

export default async function HomePage() {
  await transactionDemo();

  const features = [
    {
      icon: "🎯",
      title: "Track Daily Habits",
      description: "Set up your daily routines and mark them complete with a single click."
    },
    {
      icon: "🔥",
      title: "Build Streaks",
      description: "Watch your consistency grow with visual streak counters and achievements."
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Gain insights into your progress with beautiful charts and statistics."
    },
    {
      icon: "🏆",
      title: "Achieve Goals",
      description: "Set milestones and celebrate when you reach your habit goals."
    }
  ];

  const stats = [
    { value: "10K+", label: "Habits Tracked" },
    { value: "500+", label: "Active Users" },
    { value: "95%", label: "Success Rate" },
    { value: "30", label: "Day Avg Streak" }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <span className="badge badge-primary mb-4">✨ Your Journey Starts Here</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Build Better Habits,
            <span className="block gradient-text">One Day at a Time</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your life with HabitFlow - the modern habit tracking app that helps you 
            stay consistent, build streaks, and achieve your goals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Start Tracking Free →
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="glass-card rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you build lasting habits and transform your daily routine.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="stat-card hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-600 p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Habits?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already improved their daily routines with HabitFlow.
            </p>
            <Link 
              href="/habits" 
              className="inline-flex items-center bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Explore Habits
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Info (kept for development) */}
      <section className="py-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400">
            Environment: <span className="font-mono">{process.env.NEXT_PUBLIC_APP_ENV ?? "NOT LOADED"}</span>
            {" | "}
            API: <span className="font-mono">{process.env.NEXT_PUBLIC_API_URL ?? "NOT LOADED"}</span>
          </p>
        </div>
      </section>
    </div>
  );
}
