"use client";

import { createContext, useContext, useEffect, useReducer, ReactNode, useCallback } from "react";

/**
 * Theme types for the application
 */
type Theme = "light" | "dark" | "system";

/**
 * UI State Interface
 */
interface UIState {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  isLoading: boolean;
  pageTitle: string;
}

/**
 * UI Actions for reducer
 */
type UIAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_EFFECTIVE_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "TOGGLE_SIDEBAR_COLLAPSE" }
  | { type: "SET_SIDEBAR_COLLAPSED"; payload: boolean }
  | { type: "TOGGLE_MOBILE_MENU" }
  | { type: "SET_MOBILE_MENU_OPEN"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PAGE_TITLE"; payload: string };

/**
 * UI Context Type
 */
interface UIContextType extends UIState {
  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Mobile menu actions
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Global loading
  setLoading: (loading: boolean) => void;
  
  // Page title
  setPageTitle: (title: string) => void;
}

/**
 * Initial UI State
 */
const initialState: UIState = {
  theme: "dark", // Default to dark for our neon theme
  effectiveTheme: "dark",
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  isLoading: false,
  pageTitle: "HabitFlow",
};

/**
 * UI Reducer - handles complex state transitions predictably
 */
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "SET_THEME":
      console.log(`🎨 Theme changed to: ${action.payload}`);
      return { ...state, theme: action.payload };
    
    case "SET_EFFECTIVE_THEME":
      return { ...state, effectiveTheme: action.payload };
    
    case "TOGGLE_SIDEBAR":
      console.log(`📋 Sidebar ${!state.sidebarOpen ? "opened" : "closed"}`);
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };
    
    case "TOGGLE_SIDEBAR_COLLAPSE":
      console.log(`📋 Sidebar ${!state.sidebarCollapsed ? "collapsed" : "expanded"}`);
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case "SET_SIDEBAR_COLLAPSED":
      return { ...state, sidebarCollapsed: action.payload };
    
    case "TOGGLE_MOBILE_MENU":
      console.log(`📱 Mobile menu ${!state.mobileMenuOpen ? "opened" : "closed"}`);
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    
    case "SET_MOBILE_MENU_OPEN":
      return { ...state, mobileMenuOpen: action.payload };
    
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    
    case "SET_PAGE_TITLE":
      return { ...state, pageTitle: action.payload };
    
    default:
      return state;
  }
}

/**
 * UI Context
 */
const UIContext = createContext<UIContextType | undefined>(undefined);

/**
 * UI Provider Component
 * 
 * Manages global UI state including:
 * - Theme (light/dark/system)
 * - Sidebar visibility and collapse state
 * - Mobile menu state
 * - Global loading state
 * - Page title
 * 
 * @example
 * ```tsx
 * // Wrap your app with UIProvider
 * <UIProvider>
 *   <App />
 * </UIProvider>
 * 
 * // Use in components
 * const { theme, toggleTheme } = useUI();
 * ```
 */
export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Load saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      dispatch({ type: "SET_THEME", payload: savedTheme });
    }

    // Load sidebar collapsed state
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed) {
      dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: savedCollapsed === "true" });
    }
  }, []);

  // Handle system theme preference
  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (state.theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        dispatch({ type: "SET_EFFECTIVE_THEME", payload: prefersDark ? "dark" : "light" });
      } else {
        dispatch({ type: "SET_EFFECTIVE_THEME", payload: state.theme });
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => updateEffectiveTheme();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [state.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(state.effectiveTheme);
    
    // Save theme preference
    localStorage.setItem("theme", state.theme);
  }, [state.effectiveTheme, state.theme]);

  // Save sidebar collapsed state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(state.sidebarCollapsed));
  }, [state.sidebarCollapsed]);

  // Close mobile menu on route change (handled by listening to window resize)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && state.mobileMenuOpen) {
        dispatch({ type: "SET_MOBILE_MENU_OPEN", payload: false });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [state.mobileMenuOpen]);

  // Memoized action functions
  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: "SET_THEME", payload: theme });
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = state.effectiveTheme === "dark" ? "light" : "dark";
    dispatch({ type: "SET_THEME", payload: nextTheme });
    console.log(`🎨 Theme toggled to: ${nextTheme}`);
  }, [state.effectiveTheme]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_SIDEBAR_OPEN", payload: open });
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR_COLLAPSE" });
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: collapsed });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    dispatch({ type: "TOGGLE_MOBILE_MENU" });
  }, []);

  const setMobileMenuOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_MOBILE_MENU_OPEN", payload: open });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setPageTitle = useCallback((title: string) => {
    dispatch({ type: "SET_PAGE_TITLE", payload: title });
    // Also update document title
    document.title = title ? `${title} | HabitFlow` : "HabitFlow";
  }, []);

  const value: UIContextType = {
    ...state,
    setTheme,
    toggleTheme,
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarCollapse,
    setSidebarCollapsed,
    toggleMobileMenu,
    setMobileMenuOpen,
    setLoading,
    setPageTitle,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

/**
 * Custom hook to access UI context
 * 
 * @throws Error if used outside of UIProvider
 * @returns UI context with state and actions
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIContext();
 * ```
 */
export function useUIContext() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
}
