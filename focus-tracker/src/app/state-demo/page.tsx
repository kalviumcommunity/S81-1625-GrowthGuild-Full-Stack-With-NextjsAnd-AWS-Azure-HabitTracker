"use client";

import { useAuth, useUI, useSidebar, useNotification } from "@/hooks";
import { useState } from "react";

/**
 * State Management Demo Page
 * 
 * This page demonstrates how to use the global state management
 * system with React Context API and custom hooks.
 */
export default function StateManagementDemo() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { theme, effectiveTheme, isDarkMode, toggleTheme, setTheme, pageTitle, setPageTitle, isLoading, setLoading } = useUI();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, isCollapsed, toggleCollapse } = useSidebar();
  const { success, error, warning, info, notifications, clearAllNotifications } = useNotification();
  
  const [customTitle, setCustomTitle] = useState("");

  // Demo action handlers
  const handleShowSuccess = () => {
    success("Success!", "Your action was completed successfully.");
  };

  const handleShowError = () => {
    error("Error Occurred", "Something went wrong. Please try again.");
  };

  const handleShowWarning = () => {
    warning("Warning", "This action cannot be undone.");
  };

  const handleShowInfo = () => {
    info("Did you know?", "You can customize your theme in settings.");
  };

  const handleSetTitle = () => {
    if (customTitle.trim()) {
      setPageTitle(customTitle);
    }
  };

  const handleToggleLoading = () => {
    setLoading(!isLoading);
    if (!isLoading) {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">State Management Demo</h1>
        <p className="text-gray-400">
          Explore how to use React Context API and custom hooks for global state
        </p>
      </div>

      {/* Global Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-6 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-cyan-400 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication State Card */}
        <div className="card card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Authentication State</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className={`badge ${isAuthenticated ? "badge-success" : "badge-error"}`}>
                {authLoading ? "Loading..." : isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </span>
            </div>
            
            {isAuthenticated && user && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-mono text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Role:</span>
                  <span className="badge badge-primary">{user.role}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-gray-300 font-mono text-xs">{user.id}</span>
                </div>
              </>
            )}
            
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-3">
                <code className="text-cyan-400">useAuth()</code> hook provides: user, isAuthenticated, login, logout
              </p>
              {isAuthenticated && (
                <button 
                  onClick={logout}
                  className="btn-outline-danger w-full"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Theme State Card */}
        <div className="card card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Theme State</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Current Theme:</span>
              <span className="badge badge-primary">{theme}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Effective Theme:</span>
              <span className={`badge ${isDarkMode ? "badge-info" : "badge-warning"}`}>
                {effectiveTheme} {isDarkMode ? "🌙" : "☀️"}
              </span>
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-500">
                <code className="text-cyan-400">useTheme()</code> hook provides: theme, toggleTheme, isDarkMode
              </p>
              
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={toggleTheme}
                  className="btn-primary flex-1"
                >
                  Toggle Theme
                </button>
                <button 
                  onClick={() => setTheme("system")}
                  className="btn-outline-primary flex-1"
                >
                  Use System
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setTheme("light")}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                    theme === "light" 
                      ? "bg-white text-gray-900 border-white" 
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400"
                  }`}
                >
                  ☀️ Light
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                    theme === "dark" 
                      ? "bg-gray-900 text-cyan-400 border-cyan-400 shadow-lg shadow-cyan-500/20" 
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400"
                  }`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar State Card */}
        <div className="card card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Sidebar State</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Sidebar Open:</span>
              <span className={`badge ${sidebarOpen ? "badge-success" : "badge-error"}`}>
                {sidebarOpen ? "Open" : "Closed"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Collapsed:</span>
              <span className={`badge ${isCollapsed ? "badge-warning" : "badge-info"}`}>
                {isCollapsed ? "Collapsed" : "Expanded"}
              </span>
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-500">
                <code className="text-cyan-400">useSidebar()</code> hook provides: isOpen, toggle, isCollapsed
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={toggleSidebar}
                  className="btn-primary flex-1"
                >
                  {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                </button>
                <button 
                  onClick={toggleCollapse}
                  className="btn-outline-primary flex-1"
                >
                  {isCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Title State Card */}
        <div className="card card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Page Title State</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Current Title:</span>
              <span className="text-white font-medium">{pageTitle}</span>
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-500">
                <code className="text-cyan-400">setPageTitle()</code> updates both context and document title
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter new title..."
                  className="input-field flex-1"
                />
                <button 
                  onClick={handleSetTitle}
                  className="btn-primary"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="card card-dark p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Notification System</h2>
            </div>
            <span className="badge badge-info">{notifications.length} active</span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            <code className="text-cyan-400">useNotification()</code> hook provides: success, error, warning, info, notifications
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleShowSuccess}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
            >
              ✓ Success Toast
            </button>
            <button 
              onClick={handleShowError}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              ✕ Error Toast
            </button>
            <button 
              onClick={handleShowWarning}
              className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              ⚠ Warning Toast
            </button>
            <button 
              onClick={handleShowInfo}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              ℹ Info Toast
            </button>
            <button 
              onClick={clearAllNotifications}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Loading State Demo Card */}
        <div className="card card-dark p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Global Loading State</h2>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            <code className="text-cyan-400">setLoading(true)</code> shows a global loading overlay
          </p>
          
          <button 
            onClick={handleToggleLoading}
            className="btn-primary"
          >
            {isLoading ? "Loading Active..." : "Show Loading (2s)"}
          </button>
        </div>
      </div>

      {/* Code Examples */}
      <div className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Usage Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Using useAuth()</h3>
            <pre className="text-xs text-gray-300 overflow-x-auto">
{`const { user, isAuthenticated, logout } = useAuth();

{isAuthenticated ? (
  <span>Welcome, {user.email}!</span>
) : (
  <Link href="/login">Sign In</Link>
)}`}
            </pre>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Using useTheme()</h3>
            <pre className="text-xs text-gray-300 overflow-x-auto">
{`const { isDarkMode, toggleTheme } = useTheme();

<button onClick={toggleTheme}>
  {isDarkMode ? '🌙 Dark' : '☀️ Light'}
</button>`}
            </pre>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Using useNotification()</h3>
            <pre className="text-xs text-gray-300 overflow-x-auto">
{`const { success, error } = useNotification();

const handleSave = async () => {
  try {
    await saveHabit(data);
    success('Saved!', 'Habit created.');
  } catch (e) {
    error('Error', 'Failed to save.');
  }
};`}
            </pre>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Using useSidebar()</h3>
            <pre className="text-xs text-gray-300 overflow-x-auto">
{`const { isOpen, toggle } = useSidebar();

<button onClick={toggle}>
  {isOpen ? '◀ Close' : '▶ Open'}
</button>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
