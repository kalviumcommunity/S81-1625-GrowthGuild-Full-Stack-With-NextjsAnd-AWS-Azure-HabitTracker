"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

/**
 * LayoutWrapper Props Interface
 */
interface LayoutWrapperProps {
  /** Page content to render */
  children: React.ReactNode;
  /** Whether to show the sidebar */
  showSidebar?: boolean;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether to show the footer */
  showFooter?: boolean;
  /** Whether to use extended footer */
  extendedFooter?: boolean;
  /** Layout variant: 'default' | 'sidebar' | 'minimal' */
  variant?: "default" | "sidebar" | "minimal";
}

/**
 * LayoutWrapper Component
 * 
 * A flexible layout wrapper that provides consistent page structure.
 * Supports multiple layout variants for different page types.
 * 
 * Variants:
 * - default: Header + Main Content + Footer (current app layout)
 * - sidebar: Header + Sidebar + Main Content + Footer
 * - minimal: Just the main content
 * 
 * @example
 * ```tsx
 * import { LayoutWrapper } from "@/components";
 * 
 * // Default layout (header + content + footer)
 * <LayoutWrapper>
 *   <MyPage />
 * </LayoutWrapper>
 * 
 * // Sidebar layout
 * <LayoutWrapper variant="sidebar">
 *   <Dashboard />
 * </LayoutWrapper>
 * 
 * // Minimal layout (no header/footer)
 * <LayoutWrapper variant="minimal">
 *   <LoginPage />
 * </LayoutWrapper>
 * ```
 */
export default function LayoutWrapper({ 
  children, 
  showSidebar = false,
  showHeader = true,
  showFooter = true,
  extendedFooter = false,
  variant = "default"
}: LayoutWrapperProps) {
  const [sidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply variant presets
  const effectiveShowSidebar = variant === "sidebar" ? true : showSidebar;
  const effectiveShowHeader = variant === "minimal" ? false : showHeader;
  const effectiveShowFooter = variant === "minimal" ? false : showFooter;

  // Sidebar layout
  if (effectiveShowSidebar) {
    return (
      <div className="flex flex-col min-h-screen">
        {effectiveShowHeader && <Header />}
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar collapsed={sidebarCollapsed} />
          </div>
          
          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
              <div className="relative z-50 w-64">
                <Sidebar onLinkClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 bg-white dark:bg-slate-900 overflow-auto">
            {/* Mobile menu toggle */}
            <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open sidebar menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
        {effectiveShowFooter && <Footer extended={extendedFooter} />}
      </div>
    );
  }

  // Default layout (current app structure)
  return (
    <div className="flex flex-col min-h-screen">
      {effectiveShowHeader && <Header />}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      {effectiveShowFooter && <Footer extended={extendedFooter} />}
    </div>
  );
}

/**
 * PageContainer Component
 * 
 * A simple wrapper for consistent page content spacing
 */
export function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-8 animate-fade-in-up ${className}`}>
      {children}
    </div>
  );
}

/**
 * PageHeader Component
 * 
 * A reusable page header with title and optional actions
 */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
