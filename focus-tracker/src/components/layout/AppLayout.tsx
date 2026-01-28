"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/hooks";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * App Layout Component
 * 
 * Main application layout with sidebar navigation.
 * Features:
 * - Collapsible sidebar with state persistence
 * - Mobile hamburger menu
 * - Responsive design
 * - User profile section in header
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get display name from email
  const displayName = user?.email?.split('@')[0] || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        <div className="relative h-full">
          <Sidebar collapsed={isCollapsed} />
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-20 w-6 h-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all z-50"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              className={`w-3 h-3 transition-transform ${isCollapsed ? "rotate-180" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-screen z-50 lg:hidden
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onLinkClick={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div 
        className={`
          flex-1 flex flex-col min-h-screen
          transition-all duration-300
          ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}
        `}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[var(--sidebar-bg)]/80 backdrop-blur-xl border-b border-[var(--sidebar-border)] transition-colors">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left: Mobile Menu Button & Breadcrumb */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--charcoal-light)] transition-all"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Mobile Logo */}
              <Link href="/" className="lg:hidden flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-bold gradient-text">HabitFlow</span>
              </Link>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--charcoal-light)] transition-all relative">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                  </button>

                  {/* User Menu */}
                  <div className="flex items-center gap-3 pl-3 border-l border-[var(--card-border)]">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-[var(--foreground)]">{displayName}</p>
                      <p className="text-xs text-[var(--muted)]">{user?.role || 'User'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm">
                      {userInitial}
                    </div>
                    <button
                      onClick={logout}
                      className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--charcoal-light)] transition-all"
                      title="Logout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]/50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-[var(--muted)]">
                © 2026 HabitFlow. Capstone Project - Full Stack Development
              </p>
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary text-xs">Next.js 15</span>
                <span className="badge badge-success text-xs">TypeScript</span>
                <span className="badge badge-warning text-xs">Prisma</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
