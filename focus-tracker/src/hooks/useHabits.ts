"use client";

import useSWR, { mutate, useSWRConfig } from "swr";
import { fetcher, postData, putData, deleteData } from "@/lib/fetcher";

/**
 * Habit Types
 */
export interface Habit {
  id: number;
  title: string;
  description?: string | null;
  frequency: string;
  targetDays?: number;
  color?: string;
  icon?: string;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  completedToday?: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  logs?: HabitLog[];
}

export interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  frequency?: string;
  targetDays?: number;
  color?: string;
  icon?: string;
  userId?: number;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  isActive?: boolean;
}

/**
 * API Response wrapper type (matches responseHandler.ts format)
 */
interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * SWR Keys - Centralized key management
 */
export const SWR_KEYS = {
  habits: '/api/habits',
  habit: (id: number) => `/api/habits/${id}`,
  habitLogs: (id: number) => `/api/habits/${id}/logs`,
  users: '/api/users',
  user: (id: number) => `/api/users/${id}`,
};

/**
 * useHabits - Fetch all habits for the current user
 * 
 * Features:
 * - Automatic caching and revalidation
 * - Loading and error states
 * - Type-safe response
 * 
 * @example
 * ```tsx
 * const { habits, isLoading, error, refresh } = useHabits();
 * ```
 */
export function useHabits() {
  const { data, error, isLoading, isValidating, mutate: boundMutate } = useSWR<APIResponse<Habit[]>>(
    SWR_KEYS.habits,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 0, // Manual refresh only
    }
  );

  // Handle the API response format { success, data, message }
  const habits = data?.data ?? [];

  return {
    habits,
    isLoading,
    isValidating, // True when revalidating in background
    error,
    refresh: () => boundMutate(), // Manual refresh
    mutate: boundMutate,
    rawData: data, // For debugging
  };
}

/**
 * useHabit - Fetch a single habit by ID
 * 
 * @param id - Habit ID (pass null to skip fetching)
 * 
 * @example
 * ```tsx
 * const { habit, isLoading } = useHabit(habitId);
 * ```
 */
export function useHabit(id: number | null) {
  const { data, error, isLoading, mutate: boundMutate } = useSWR<APIResponse<Habit>>(
    id ? SWR_KEYS.habit(id) : null, // null key skips fetching
    fetcher
  );

  return {
    habit: data?.data ?? null,
    isLoading,
    error,
    mutate: boundMutate,
  };
}

/**
 * useHabitMutations - CRUD operations for habits with optimistic updates
 * 
 * Provides mutation functions that:
 * 1. Update UI immediately (optimistic)
 * 2. Send request to API
 * 3. Revalidate cache on success
 * 4. Rollback on error
 * 
 * @example
 * ```tsx
 * const { createHabit, updateHabit, deleteHabit, toggleComplete } = useHabitMutations();
 * 
 * await createHabit({ title: 'Exercise', frequency: 'daily' });
 * await toggleComplete(habitId);
 * ```
 */
export function useHabitMutations() {
  const { cache } = useSWRConfig();

  /**
   * Helper to get current habits from cache
   */
  const getCurrentHabits = (): Habit[] => {
    const cached = cache.get(SWR_KEYS.habits)?.data as APIResponse<Habit[]> | undefined;
    return cached?.data ?? [];
  };

  /**
   * Helper to create optimistic cache update
   */
  const createOptimisticData = (habits: Habit[]): APIResponse<Habit[]> => ({
    success: true,
    message: 'Optimistic update',
    data: habits,
    timestamp: new Date().toISOString(),
  });

  /**
   * Create a new habit with optimistic update
   */
  const createHabit = async (input: CreateHabitInput): Promise<Habit | null> => {
    const currentHabits = getCurrentHabits();
    
    // Create optimistic habit
    const optimisticHabit: Habit = {
      id: Date.now(), // Temporary ID
      title: input.title,
      description: input.description || null,
      frequency: input.frequency || 'DAILY',
      isActive: true,
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: input.userId || 0,
    };

    // Store original data for rollback
    const originalData = createOptimisticData(currentHabits);

    try {
      // Optimistic update - add habit immediately
      await mutate(
        SWR_KEYS.habits,
        createOptimisticData([...currentHabits, optimisticHabit]),
        false // Don't revalidate yet
      );

      // Actual API call
      const response = await postData<APIResponse<Habit>>(SWR_KEYS.habits, input);

      // Revalidate to get the real data from server
      await mutate(SWR_KEYS.habits);

      console.log('✅ Habit created:', response?.data?.title || input.title);
      return response?.data || null;
    } catch (error) {
      // Rollback on error
      await mutate(SWR_KEYS.habits, originalData, false);
      console.error('❌ Failed to create habit:', error);
      throw error;
    }
  };

  /**
   * Update an existing habit with optimistic update
   */
  const updateHabit = async (id: number, input: UpdateHabitInput): Promise<Habit | null> => {
    const currentHabits = getCurrentHabits();
    const originalData = createOptimisticData(currentHabits);

    try {
      // Optimistic update
      const updatedHabits = currentHabits.map((h) =>
        h.id === id ? { ...h, ...input, updatedAt: new Date().toISOString() } : h
      );
      await mutate(
        SWR_KEYS.habits,
        createOptimisticData(updatedHabits),
        false
      );

      // Actual API call
      const response = await putData<APIResponse<Habit>>(SWR_KEYS.habit(id), input);

      // Revalidate both the list and individual habit
      await Promise.all([
        mutate(SWR_KEYS.habits),
        mutate(SWR_KEYS.habit(id)),
      ]);

      console.log('✅ Habit updated:', response?.data?.title);
      return response?.data || null;
    } catch (error) {
      // Rollback on error
      await mutate(SWR_KEYS.habits, originalData, false);
      console.error('❌ Failed to update habit:', error);
      throw error;
    }
  };

  /**
   * Delete a habit with optimistic update
   */
  const deleteHabit = async (id: number): Promise<void> => {
    const currentHabits = getCurrentHabits();
    const originalData = createOptimisticData(currentHabits);

    try {
      // Optimistic update - remove from list immediately
      const filteredHabits = currentHabits.filter((h) => h.id !== id);
      await mutate(
        SWR_KEYS.habits,
        createOptimisticData(filteredHabits),
        false
      );

      // Actual API call
      await deleteData(SWR_KEYS.habit(id));

      // Revalidate
      await mutate(SWR_KEYS.habits);

      console.log('✅ Habit deleted:', id);
    } catch (error) {
      // Rollback on error
      await mutate(SWR_KEYS.habits, originalData, false);
      console.error('❌ Failed to delete habit:', error);
      throw error;
    }
  };

  /**
   * Toggle habit completion for today
   */
  const toggleComplete = async (id: number): Promise<void> => {
    const currentHabits = getCurrentHabits();
    const habit = currentHabits.find((h) => h.id === id);
    const originalData = createOptimisticData(currentHabits);

    if (!habit) return;

    const newCompletedState = !habit.completedToday;

    try {
      // Optimistic update
      const updatedHabits = currentHabits.map((h) =>
        h.id === id
          ? {
              ...h,
              completedToday: newCompletedState,
              currentStreak: newCompletedState ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
            }
          : h
      );
      await mutate(
        SWR_KEYS.habits,
        createOptimisticData(updatedHabits),
        false
      );

      // API call to log completion
      await postData(`${SWR_KEYS.habit(id)}/complete`, { completed: newCompletedState });

      // Revalidate
      await mutate(SWR_KEYS.habits);

      console.log(`✅ Habit ${newCompletedState ? 'completed' : 'uncompleted'}:`, habit.title);
    } catch (error) {
      // Rollback on error
      await mutate(SWR_KEYS.habits, originalData, false);
      console.error('❌ Failed to toggle habit completion:', error);
      throw error;
    }
  };

  return {
    createHabit,
    updateHabit,
    deleteHabit,
    toggleComplete,
  };
}

/**
 * useCacheDebug - Debug utility to inspect SWR cache
 * 
 * @example
 * ```tsx
 * const { logCache, getCacheKeys } = useCacheDebug();
 * logCache(); // Logs all cache entries
 * ```
 */
export function useCacheDebug() {
  const { cache } = useSWRConfig();

  const getCacheKeys = (): string[] => {
    const keys: string[] = [];
    // SWR cache is a Map-like structure
    try {
      // @ts-ignore - accessing internal cache structure
      if (typeof cache.keys === 'function') {
        for (const key of cache.keys()) {
          keys.push(key as string);
        }
      }
    } catch (e) {
      console.warn('Could not enumerate cache keys:', e);
    }
    return keys;
  };

  const logCache = () => {
    const keys = getCacheKeys();
    console.log('🗃️ SWR Cache Keys:', keys);
    keys.forEach((key) => {
      const entry = cache.get(key);
      console.log(`  📦 ${key}:`, entry);
    });
  };

  const getCacheData = (key: string) => {
    return cache.get(key);
  };

  return {
    getCacheKeys,
    logCache,
    getCacheData,
  };
}
