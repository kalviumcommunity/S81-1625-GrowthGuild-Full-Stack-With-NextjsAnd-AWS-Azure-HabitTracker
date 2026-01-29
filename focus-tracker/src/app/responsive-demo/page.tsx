"use client";

import { useTheme } from "@/hooks";

/**
 * Responsive Design Demo Page
 * 
 * Demonstrates:
 * - Tailwind responsive breakpoints (sm, md, lg, xl, 2xl)
 * - Theme-aware styling (light/dark mode)
 * - Responsive grid layouts
 * - Adaptive typography
 * - Mobile-first design patterns
 */
export default function ResponsiveDemoPage() {
  const { theme, effectiveTheme, isDarkMode, toggleTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Page Header - Responsive Typography */}
      <header className="mb-6 md:mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-2 md:mb-4">
          Responsive Design Demo
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[var(--foreground-muted)]">
          Testing responsive breakpoints and theme switching across all devices
        </p>
      </header>

      {/* Breakpoint Indicator */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4">
          Current Breakpoint
        </h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-brand-500 text-white xs:bg-gray-500 sm:bg-blue-500 md:bg-green-500 lg:bg-yellow-500 xl:bg-purple-500 2xl:bg-pink-500">
            <span className="inline xs:hidden">Base (&lt;475px)</span>
            <span className="hidden xs:inline sm:hidden">XS (475px+)</span>
            <span className="hidden sm:inline md:hidden">SM (640px+)</span>
            <span className="hidden md:inline lg:hidden">MD (768px+)</span>
            <span className="hidden lg:inline xl:hidden">LG (1024px+)</span>
            <span className="hidden xl:inline 2xl:hidden">XL (1280px+)</span>
            <span className="hidden 2xl:inline">2XL (1536px+)</span>
          </span>
        </div>
      </section>

      {/* Theme Controls */}
      <section className="mb-8 md:mb-12 p-4 md:p-6 lg:p-8 card-theme rounded-xl">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          🎨 Theme Controls
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Current Theme Status */}
          <div className="p-4 md:p-6 bg-[var(--charcoal-light)] rounded-xl">
            <h3 className="text-sm md:text-base font-medium text-[var(--muted)] mb-2">
              Current Theme
            </h3>
            <p className="text-xl md:text-2xl font-bold text-[var(--foreground)]">
              {effectiveTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </p>
            <p className="text-xs md:text-sm text-[var(--muted)] mt-1">
              Setting: {theme}
            </p>
          </div>

          {/* Theme Toggle Button */}
          <div className="p-4 md:p-6 bg-[var(--charcoal-light)] rounded-xl">
            <h3 className="text-sm md:text-base font-medium text-[var(--muted)] mb-2">
              Toggle Theme
            </h3>
            <button
              onClick={toggleTheme}
              className="w-full py-2 md:py-3 px-4 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-all text-sm md:text-base"
            >
              Switch to {isDarkMode ? "Light" : "Dark"}
            </button>
          </div>

          {/* Theme Preset Buttons */}
          <div className="p-4 md:p-6 bg-[var(--charcoal-light)] rounded-xl sm:col-span-2">
            <h3 className="text-sm md:text-base font-medium text-[var(--muted)] mb-2">
              Theme Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  theme === "light"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)]"
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  theme === "dark"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)]"
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  theme === "system"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)]"
                }`}
              >
                💻 System
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Grid Demo */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          📱 Responsive Grid Layout
        </h2>
        <p className="text-sm md:text-base text-[var(--muted)] mb-4">
          Grid changes: 1 col → 2 cols (sm) → 3 cols (lg) → 4 cols (xl)
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="p-4 md:p-6 card-theme rounded-xl hover-lift"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-3 md:mb-4">
                <span className="text-white font-bold text-lg md:text-xl">{item}</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)] mb-1 md:mb-2">
                Card {item}
              </h3>
              <p className="text-xs md:text-sm text-[var(--muted)]">
                Responsive card that adapts to screen size
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="mb-8 md:mb-12 p-4 md:p-6 lg:p-8 card-theme rounded-xl">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          📝 Responsive Typography
        </h2>
        
        <div className="space-y-4 md:space-y-6">
          <div>
            <span className="text-xs md:text-sm text-[var(--muted)] block mb-1">
              Heading XL: text-2xl → sm:text-3xl → md:text-4xl → lg:text-5xl
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              Extra Large Heading
            </p>
          </div>
          
          <div>
            <span className="text-xs md:text-sm text-[var(--muted)] block mb-1">
              Heading LG: text-xl → sm:text-2xl → md:text-3xl
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
              Large Heading
            </p>
          </div>
          
          <div>
            <span className="text-xs md:text-sm text-[var(--muted)] block mb-1">
              Body: text-sm → sm:text-base → md:text-lg
            </span>
            <p className="text-sm sm:text-base md:text-lg text-[var(--foreground-muted)]">
              This is body text that scales up on larger screens for better readability.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          
          <div>
            <span className="text-xs md:text-sm text-[var(--muted)] block mb-1">
              Small/Caption: text-xs → sm:text-sm
            </span>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Small text for captions, labels, and metadata
            </p>
          </div>
        </div>
      </section>

      {/* Spacing Demo */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          📐 Responsive Spacing
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Padding Demo */}
          <div className="card-theme rounded-xl overflow-hidden">
            <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-[var(--primary)]/10 border-2 border-dashed border-[var(--primary)]">
              <p className="text-sm md:text-base text-[var(--foreground)]">
                <strong>Padding:</strong> p-2 → sm:p-4 → md:p-6 → lg:p-8
              </p>
            </div>
          </div>
          
          {/* Margin Demo */}
          <div className="card-theme rounded-xl p-4 md:p-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
              <div className="h-4 md:h-6 bg-[var(--primary)] rounded"></div>
              <div className="h-4 md:h-6 bg-[var(--secondary)] rounded"></div>
              <div className="h-4 md:h-6 bg-[var(--success)] rounded"></div>
            </div>
            <p className="text-xs md:text-sm text-[var(--muted)] mt-4">
              <strong>Gap:</strong> space-y-2 → sm:space-y-3 → md:space-y-4 → lg:space-y-6
            </p>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          🎨 Theme Color Palette
        </h2>
        <p className="text-sm md:text-base text-[var(--muted)] mb-4">
          Colors adapt automatically based on light/dark theme
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            { name: "Primary", color: "var(--primary)" },
            { name: "Secondary", color: "var(--secondary)" },
            { name: "Accent", color: "var(--accent)" },
            { name: "Success", color: "var(--success)" },
            { name: "Danger", color: "var(--danger)" },
            { name: "Muted", color: "var(--muted)" },
          ].map((c) => (
            <div key={c.name} className="text-center">
              <div
                className="w-full aspect-square rounded-xl mb-2 shadow-lg"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-xs md:text-sm font-medium text-[var(--foreground)]">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive Flex Layout */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          🔄 Responsive Flex Direction
        </h2>
        <p className="text-sm md:text-base text-[var(--muted)] mb-4">
          Stack vertically on mobile, horizontal on larger screens
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1 p-4 md:p-6 card-theme rounded-xl">
            <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)] mb-2">
              Section 1
            </h3>
            <p className="text-sm text-[var(--muted)]">
              Stacks vertically on mobile
            </p>
          </div>
          <div className="flex-1 p-4 md:p-6 card-theme rounded-xl">
            <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)] mb-2">
              Section 2
            </h3>
            <p className="text-sm text-[var(--muted)]">
              Side by side on tablet+
            </p>
          </div>
          <div className="flex-1 p-4 md:p-6 card-theme rounded-xl">
            <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)] mb-2">
              Section 3
            </h3>
            <p className="text-sm text-[var(--muted)]">
              flex-col → md:flex-row
            </p>
          </div>
        </div>
      </section>

      {/* Breakpoint Reference */}
      <section className="p-4 md:p-6 lg:p-8 card-theme rounded-xl">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-4 md:mb-6">
          📋 Breakpoint Reference
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="py-2 md:py-3 pr-4 text-[var(--foreground)] font-semibold">Breakpoint</th>
                <th className="py-2 md:py-3 pr-4 text-[var(--foreground)] font-semibold">Min Width</th>
                <th className="py-2 md:py-3 text-[var(--foreground)] font-semibold">CSS</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--card-border)]/50">
                <td className="py-2 md:py-3 pr-4 font-medium">xs</td>
                <td className="py-2 md:py-3 pr-4">475px</td>
                <td className="py-2 md:py-3"><code className="text-[var(--primary)]">@media (min-width: 475px)</code></td>
              </tr>
              <tr className="border-b border-[var(--card-border)]/50">
                <td className="py-2 md:py-3 pr-4 font-medium">sm</td>
                <td className="py-2 md:py-3 pr-4">640px</td>
                <td className="py-2 md:py-3"><code className="text-[var(--primary)]">@media (min-width: 640px)</code></td>
              </tr>
              <tr className="border-b border-[var(--card-border)]/50">
                <td className="py-2 md:py-3 pr-4 font-medium">md</td>
                <td className="py-2 md:py-3 pr-4">768px</td>
                <td className="py-2 md:py-3"><code className="text-[var(--primary)]">@media (min-width: 768px)</code></td>
              </tr>
              <tr className="border-b border-[var(--card-border)]/50">
                <td className="py-2 md:py-3 pr-4 font-medium">lg</td>
                <td className="py-2 md:py-3 pr-4">1024px</td>
                <td className="py-2 md:py-3"><code className="text-[var(--primary)]">@media (min-width: 1024px)</code></td>
              </tr>
              <tr className="border-b border-[var(--card-border)]/50">
                <td className="py-2 md:py-3 pr-4 font-medium">xl</td>
                <td className="py-2 md:py-3 pr-4">1280px</td>
                <td className="py-2 md:py-3"><code className="text-[var(--primary)]">@media (min-width: 1280px)</code></td>
              </tr>
              <tr>
                <td className="py-2 md:py-3 pr-4 font-medium">2xl</td>
                <td className="py-2 md:py-3 pr-4">1536px</td>
                <td className="py-2 md:py-3"><code className="text-[var(--primary)]">@media (min-width: 1536px)</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
