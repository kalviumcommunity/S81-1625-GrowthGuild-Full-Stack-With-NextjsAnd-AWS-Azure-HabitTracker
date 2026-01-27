"use client";

import { useUIContext } from "@/context/UIContext";

/**
 * useUI - Custom hook for UI state management
 * 
 * A clean wrapper around UIContext that provides:
 * - Theme control (light/dark/system)
 * - Sidebar visibility and collapse state
 * - Mobile menu control
 * - Global loading state
 * - Page title management
 * 
 * This hook follows the pattern of wrapping context hooks
 * to provide a cleaner API and allow for future enhancements
 * without changing component code.
 * 
 * @returns UI state and action functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();
 * 
 * // Theme control
 * <button onClick={toggleTheme}>
 *   {theme === 'dark' ? '🌙' : '☀️'}
 * </button>
 * 
 * // Sidebar control
 * <button onClick={toggleSidebar}>
 *   {sidebarOpen ? '◀' : '▶'}
 * </button>
 * 
 * // Page title
 * useEffect(() => {
 *   setPageTitle('Dashboard');
 * }, [setPageTitle]);
 * ```
 */
export function useUI() {
  const context = useUIContext();
  
  return {
    // Theme state
    theme: context.theme,
    effectiveTheme: context.effectiveTheme,
    isDarkMode: context.effectiveTheme === "dark",
    isLightMode: context.effectiveTheme === "light",
    
    // Theme actions
    setTheme: context.setTheme,
    toggleTheme: context.toggleTheme,
    
    // Sidebar state
    sidebarOpen: context.sidebarOpen,
    sidebarCollapsed: context.sidebarCollapsed,
    
    // Sidebar actions
    toggleSidebar: context.toggleSidebar,
    setSidebarOpen: context.setSidebarOpen,
    toggleSidebarCollapse: context.toggleSidebarCollapse,
    setSidebarCollapsed: context.setSidebarCollapsed,
    
    // Mobile menu state
    mobileMenuOpen: context.mobileMenuOpen,
    
    // Mobile menu actions
    toggleMobileMenu: context.toggleMobileMenu,
    setMobileMenuOpen: context.setMobileMenuOpen,
    
    // Loading state
    isLoading: context.isLoading,
    setLoading: context.setLoading,
    
    // Page title
    pageTitle: context.pageTitle,
    setPageTitle: context.setPageTitle,
  };
}

/**
 * useTheme - Focused hook for theme-only operations
 * 
 * Use this when you only need theme functionality
 * to keep component imports minimal.
 * 
 * @example
 * ```tsx
 * const { isDarkMode, toggleTheme } = useTheme();
 * ```
 */
export function useTheme() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useUIContext();
  
  return {
    theme,
    effectiveTheme,
    isDarkMode: effectiveTheme === "dark",
    isLightMode: effectiveTheme === "light",
    setTheme,
    toggleTheme,
  };
}

/**
 * useSidebar - Focused hook for sidebar operations
 * 
 * Use this when you only need sidebar functionality.
 * 
 * @example
 * ```tsx
 * const { isOpen, toggle, isCollapsed } = useSidebar();
 * ```
 */
export function useSidebar() {
  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarCollapse,
    setSidebarCollapsed,
  } = useUIContext();
  
  return {
    isOpen: sidebarOpen,
    isCollapsed: sidebarCollapsed,
    toggle: toggleSidebar,
    setOpen: setSidebarOpen,
    toggleCollapse: toggleSidebarCollapse,
    setCollapsed: setSidebarCollapsed,
  };
}

/**
 * useMobileMenu - Focused hook for mobile menu
 * 
 * @example
 * ```tsx
 * const { isOpen, toggle } = useMobileMenu();
 * ```
 */
export function useMobileMenu() {
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIContext();
  
  return {
    isOpen: mobileMenuOpen,
    toggle: toggleMobileMenu,
    setOpen: setMobileMenuOpen,
  };
}

/**
 * usePageTitle - Hook to set page title declaratively
 * 
 * @example
 * ```tsx
 * // Sets title on mount, clears on unmount
 * usePageTitle('Dashboard');
 * ```
 */
export function usePageTitle(title: string) {
  const { setPageTitle } = useUIContext();
  
  // Effect to set title on mount
  if (typeof window !== "undefined") {
    setPageTitle(title);
  }
  
  return { setPageTitle };
}
