"use client";

/**
 * Custom Hooks Barrel Export
 * 
 * This file exports all custom hooks from a single entry point,
 * making imports cleaner throughout the application.
 * 
 * @example
 * ```tsx
 * import { useAuth, useUI, useTheme, useNotification, useHabits } from '@/hooks';
 * ```
 */

// Re-export useAuth from AuthContext (it's defined there)
export { useAuth } from "@/context/AuthContext";

// UI hooks
export { 
  useUI, 
  useTheme, 
  useSidebar, 
  useMobileMenu, 
  usePageTitle 
} from "./useUI";

// Notification hook
export { useNotification } from "@/context/NotificationContext";

// SWR Data fetching hooks
export {
  useHabits,
  useHabit,
  useHabitMutations,
  useCacheDebug,
  SWR_KEYS,
} from "./useHabits";
export type { Habit, HabitLog, CreateHabitInput, UpdateHabitInput } from "./useHabits";
