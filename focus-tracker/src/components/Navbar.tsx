"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">HabitFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" icon="🏠">Home</NavLink>
            {isAuthenticated && (
              <>
                <NavLink href="/dashboard" icon="📊">Dashboard</NavLink>
                <NavLink href="/habits" icon="🎯">Habits</NavLink>
                <NavLink href="/uploads" icon="☁️">Uploads</NavLink>
              </>
            )}
            <NavLink href="/about" icon="ℹ️">About</NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 max-w-[120px] truncate">
                      {user?.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="hidden sm:inline-flex btn-primary text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 font-medium"
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
