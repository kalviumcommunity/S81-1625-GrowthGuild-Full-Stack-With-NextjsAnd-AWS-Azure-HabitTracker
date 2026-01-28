"use client";

import { ReactNode } from "react";
import { UIProvider } from "@/context/UIContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/context/AuthContext";
import { SWRProvider } from "@/lib/swr-provider";
import ToastContainer from "@/components/ToastContainer";

/**
 * ClientProviders Component
 * 
 * Wraps the application with all client-side context providers.
 * This component must be a client component because:
 * - Context providers use React hooks (useState, useEffect)
 * - ToastContainer uses useNotification hook
 * - SWR requires client-side context
 * 
 * Provider order (outermost to innermost):
 * 1. SWRProvider - Data fetching configuration
 * 2. UIProvider - Theme and layout state
 * 3. NotificationProvider - Toast notifications
 * 4. AuthProvider - Authentication state
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SWRProvider>
      <UIProvider>
        <NotificationProvider>
          <AuthProvider>
            <ToastContainer />
            {children}
          </AuthProvider>
        </NotificationProvider>
      </UIProvider>
    </SWRProvider>
  );
}
