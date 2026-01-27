"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
    { href: "/about", label: "About", icon: "ℹ️" },
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
        h-screen bg-gray-900 
        border-r border-gray-800 
        flex flex-col
        transition-all duration-300
        ${className}
      `}
      aria-label="Sidebar navigation"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800">
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
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
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
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-cyan-400"
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
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h2>
            <ul className="space-y-1" role="list">
              {quickActions.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    onClick={onLinkClick}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-cyan-400 transition-all duration-200"
                  >
                    <span className="text-lg" aria-hidden="true">{action.icon}</span>
                    <span className="text-sm">{action.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>HabitFlow</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      )}
    </aside>
  );
}
