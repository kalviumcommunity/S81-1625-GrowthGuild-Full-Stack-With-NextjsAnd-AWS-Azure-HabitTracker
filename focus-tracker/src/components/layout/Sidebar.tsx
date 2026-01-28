"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks";

/**
 * Sidebar Navigation Item Interface
 */
interface SidebarLink {
  href: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
}

/**
 * Sidebar Props Interface
 */
interface SidebarProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether the sidebar is collapsed (mobile view) */
  collapsed?: boolean;
  /** Callback when a link is clicked (useful for mobile menu close) */
  onLinkClick?: () => void;
}

/**
 * Sidebar Component
 * 
 * A reusable sidebar navigation component that provides:
 * - Contextual navigation based on authentication status
 * - Active route highlighting
 * - Responsive design with collapsed state support
 * - Keyboard accessible navigation
 * 
 * @example
 * ```tsx
 * import { Sidebar } from "@/components";
 * <Sidebar />
 * 
 * // With collapse state
 * <Sidebar collapsed={isMobile} onLinkClick={() => setMenuOpen(false)} />
 * ```
 */
export default function Sidebar({ className = "", collapsed = false, onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const navigationLinks: SidebarLink[] = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "Dashboard", icon: "📊", requiresAuth: true },
    { href: "/habits", label: "My Habits", icon: "🎯", requiresAuth: true },
    { href: "/users", label: "Users", icon: "👥", requiresAuth: true },
    { href: "/uploads", label: "Uploads", icon: "☁️", requiresAuth: true },
    { href: "/contact", label: "Contact", icon: "✉️" },
    { href: "/about", label: "About", icon: "ℹ️" },
  ];

  const demoLinks: SidebarLink[] = [
    { href: "/forms-demo", label: "Forms Demo", icon: "📋" },
    { href: "/swr-demo", label: "SWR Demo", icon: "🔄" },
    { href: "/state-demo", label: "State Demo", icon: "⚡" },
    { href: "/feedback-demo", label: "Feedback Demo", icon: "🔔" },
  ];

  const filteredLinks = navigationLinks.filter(
    link => !link.requiresAuth || isAuthenticated
  );

  const quickActions = [
    { label: "New Habit", icon: "➕", href: "/habits" },
    { label: "View Stats", icon: "📈", href: "/dashboard" },
  ];

  return (
    <aside 
      className={`
        ${collapsed ? "w-16" : "w-64"} 
        h-screen 
        bg-[var(--sidebar-bg)]
        border-r border-[var(--sidebar-border)]
        flex flex-col
        transition-all duration-300
        ${className}
      `}
      aria-label="Sidebar navigation"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-[var(--sidebar-border)]">
        <Link href="/" className="flex items-center space-x-2" onClick={onLinkClick}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold gradient-text">HabitFlow</span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 overflow-y-auto" aria-label="Main navigation">
        <div className="space-y-1">
          {!collapsed && (
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3 px-3">
              Navigation
            </h2>
          )}
          <ul className="space-y-1" role="list">
            {filteredLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={`
                      flex items-center ${collapsed ? "justify-center" : "space-x-3"} 
                      px-3 py-2.5 rounded-xl
                      transition-all duration-200
                      ${isActive 
                        ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] font-semibold" 
                        : "text-[var(--muted)] hover:bg-[var(--charcoal-light)] hover:text-[var(--primary)]"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? link.label : undefined}
                  >
                    <span className="text-xl" aria-hidden="true">{link.icon}</span>
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Actions - Only shown when authenticated and not collapsed */}
        {isAuthenticated && !collapsed && (
          <div className="mt-8">
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h2>
            <ul className="space-y-1" role="list">
              {quickActions.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    onClick={onLinkClick}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[var(--muted)] hover:bg-[var(--charcoal-light)] hover:text-[var(--primary)] transition-all duration-200"
                  >
                    <span className="text-lg" aria-hidden="true">{action.icon}</span>
                    <span className="text-sm">{action.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Demo Links Section */}
        {!collapsed && (
          <div className="mt-8">
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3 px-3">
              Demos
            </h2>
            <ul className="space-y-1" role="list">
              {demoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[var(--muted)] hover:bg-[var(--charcoal-light)] hover:text-[var(--secondary)] transition-all duration-200"
                  >
                    <span className="text-lg" aria-hidden="true">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer Section with Theme Toggle */}
      <div className={`p-4 border-t border-[var(--sidebar-border)] ${collapsed ? "flex justify-center" : ""}`}>
        <ThemeToggle collapsed={collapsed} />
        {!collapsed && (
          <div className="flex items-center space-x-2 text-xs text-[var(--muted)] mt-3">
            <span>HabitFlow</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * Theme Toggle Component
 * 
 * A button that toggles between dark and light themes.
 * Shows sun icon for dark mode (click to switch to light)
 * Shows moon icon for light mode (click to switch to dark)
 */
function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { isDarkMode, toggleTheme, effectiveTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${collapsed ? "w-10 h-10" : "w-full"} 
        flex items-center ${collapsed ? "justify-center" : "space-x-3"}
        px-3 py-2.5 rounded-xl
        bg-[var(--charcoal-light)] hover:bg-[var(--card-border)]
        text-[var(--muted)] hover:text-[var(--accent)]
        transition-all duration-300
        group
      `}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} theme. Current theme: ${effectiveTheme}`}
      title={collapsed ? `Switch to ${isDarkMode ? "light" : "dark"} mode` : undefined}
    >
      {/* Sun/Moon Icon with animation */}
      <div className="relative w-6 h-6 flex-shrink-0">
        {/* Sun Icon - shown in dark mode */}
        <svg
          className={`
            absolute inset-0 w-6 h-6 
            transition-all duration-300
            ${isDarkMode 
              ? "opacity-100 rotate-0 scale-100 text-yellow-400" 
              : "opacity-0 rotate-90 scale-50 text-yellow-400"
            }
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {/* Moon Icon - shown in light mode */}
        <svg
          className={`
            absolute inset-0 w-6 h-6 
            transition-all duration-300
            ${!isDarkMode 
              ? "opacity-100 rotate-0 scale-100 text-indigo-400" 
              : "opacity-0 -rotate-90 scale-50 text-indigo-400"
            }
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
      
      {/* Label - only shown when not collapsed */}
      {!collapsed && (
        <span className="text-sm font-medium">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
