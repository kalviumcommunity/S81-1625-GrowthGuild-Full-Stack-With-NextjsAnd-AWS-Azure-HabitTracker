export const revalidate = false;

export default function AboutPage() {
  const techStack = [
    { name: "Next.js 15", icon: "⚡", description: "React framework with App Router" },
    { name: "TypeScript", icon: "📘", description: "Type-safe development" },
    { name: "Prisma", icon: "🔷", description: "Modern database ORM" },
    { name: "PostgreSQL", icon: "🐘", description: "Reliable data storage" },
    { name: "Tailwind CSS", icon: "🎨", description: "Utility-first styling" },
    { name: "Redis", icon: "🔴", description: "Caching & sessions" },
  ];

  const features = [
    "RESTful API with comprehensive error handling",
    "Database transactions with Prisma",
    "Redis caching for optimized performance",
    "User authentication and role-based access",
    "Responsive design with dark mode support",
    "Server-side rendering with incremental static regeneration",
  ];

  const team = [
    { role: "Full Stack Developer", focus: "Architecture & Backend" },
    { role: "Frontend Engineer", focus: "UI/UX & Responsive Design" },
    { role: "DevOps", focus: "Deployment & Infrastructure" },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Hero Section */}
      <section className="text-center py-12">
        <span className="badge badge-primary mb-4">🎓 Capstone Project</span>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          About <span className="gradient-text">HabitFlow</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A full-stack habit tracking application demonstrating modern web development 
          practices with Next.js, TypeScript, and cloud technologies.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="glass-card rounded-2xl p-8 sm:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-cyan-500/30">
            🎯
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            HabitFlow was created to help users build lasting habits through a beautiful, 
            intuitive interface and powerful tracking features. This capstone project showcases 
            the integration of modern technologies to create a production-ready application 
            that solves real-world problems.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Technology Stack</h2>
          <p className="text-gray-400">
            Built with cutting-edge technologies for optimal performance
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, index) => (
            <div 
              key={index}
              className="stat-card hover-lift text-center"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-4xl mb-3">{tech.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{tech.name}</h3>
              <p className="text-xs text-gray-400">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 animate-slide-in-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span> Project Statistics
          </h3>
          <div className="space-y-4">
            <StatItem label="Lines of Code" value="5,000+" />
            <StatItem label="API Endpoints" value="12" />
            <StatItem label="Database Tables" value="4" />
            <StatItem label="Components" value="15+" />
            <StatItem label="Test Coverage" value="85%" />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="stat-card">
        <h2 className="text-2xl font-bold mb-6 text-center">System Architecture</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ArchitectureCard 
            title="Frontend"
            icon="🖥️"
            items={["Next.js App Router", "React Server Components", "Tailwind CSS", "TypeScript"]}
          />
          <ArchitectureCard 
            title="Backend"
            icon="⚙️"
            items={["Next.js API Routes", "Prisma ORM", "PostgreSQL", "Redis Cache"]}
          />
          <ArchitectureCard 
            title="Infrastructure"
            icon="☁️"
            items={["Docker Containers", "CI/CD Pipeline", "Environment Config", "Logging System"]}
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6">Development Team</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="stat-card hover-lift">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-semibold">{member.role}</h3>
              <p className="text-sm text-gray-400">{member.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-8">
        <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6">
            Start building better habits today with HabitFlow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/dashboard" className="btn-primary">
              View Dashboard
            </a>
            <a href="/habits" className="btn-secondary">
              Explore Habits
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold gradient-text">{value}</span>
    </div>
  );
}

function ArchitectureCard({ title, icon, items }: { title: string; icon: string; items: string[] }) {
  return (
    <div className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-400">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
