"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { fetcher } from "@/lib/fetcher";

/**
 * SWR Configuration Options
 * 
 * These settings control how SWR behaves globally across the app.
 */
const swrOptions = {
  // Use our custom fetcher with auth support
  fetcher,
  
  // Revalidation settings
  revalidateOnFocus: true,        // Refetch when window regains focus
  revalidateOnReconnect: true,    // Refetch when network reconnects
  revalidateIfStale: true,        // Revalidate if data is stale
  
  // Deduplication - prevent multiple identical requests
  dedupingInterval: 2000,         // 2 seconds
  
  // Error retry configuration
  onErrorRetry: (error: any, key: string, config: any, revalidate: any, { retryCount }: { retryCount: number }) => {
    // Don't retry on 404 or 401/403
    if (error.status === 404 || error.status === 401 || error.status === 403) return;
    
    // Only retry up to 3 times
    if (retryCount >= 3) return;
    
    // Retry after 2 seconds with exponential backoff
    setTimeout(() => revalidate({ retryCount }), 2000 * Math.pow(2, retryCount));
  },

  // Cache settings
  shouldRetryOnError: true,

  // Loading state timeout
  loadingTimeout: 3000,           // Show loading state after 3s

  // Focus throttle to prevent too many revalidations
  focusThrottleInterval: 5000,    // 5 seconds between focus revalidations
};

/**
 * SWRProvider Component
 * 
 * Wraps the application with SWR configuration for global settings.
 * This enables consistent caching, revalidation, and error handling
 * across all useSWR hooks in the app.
 * 
 * @example
 * ```tsx
 * // In layout or providers
 * <SWRProvider>
 *   <App />
 * </SWRProvider>
 * 
 * // Then in any component
 * const { data, error } = useSWR('/api/habits');
 * ```
 */
export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={swrOptions}>
      {children}
    </SWRConfig>
  );
}

/**
 * Export configuration for debugging/testing
 */
export { swrOptions };
