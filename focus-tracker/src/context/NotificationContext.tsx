"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Notification Types - includes loading for process feedback
 */
export type NotificationType = "success" | "error" | "warning" | "info" | "loading";

/**
 * Notification Interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, 0 for persistent
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Promise-based toast messages for loading state
 */
interface PromiseMessages {
  loading: string;
  success: string;
  error: string;
}

/**
 * Notification Context Type
 */
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  updateNotification: (id: string, notification: Partial<Omit<Notification, "id">>) => void;
  clearAllNotifications: () => void;
  
  // Convenience methods
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  loading: (title: string, message?: string) => string;
  
  // Promise-based helper for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: PromiseMessages
  ) => Promise<T>;
}

/**
 * Generate unique ID for notifications
 */
const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Notification Provider Component
 * 
 * Manages global notification state for toast messages,
 * alerts, and other user feedback.
 * 
 * @example
 * ```tsx
 * // Wrap your app
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 * 
 * // Use in components
 * const { success, error } = useNotification();
 * success("Saved!", "Your changes have been saved.");
 * error("Error", "Failed to save changes.");
 * ```
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    console.log(`🔕 Notification dismissed: ${id}`);
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<Omit<Notification, "id">>) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
    console.log(`🔄 Notification updated: ${id}`);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // Default 5 seconds
      dismissible: notification.dismissible ?? true,
    };

    setNotifications((prev) => [...prev, newNotification]);
    console.log(`🔔 Notification added: [${notification.type.toUpperCase()}] ${notification.title}`);

    // Auto-dismiss if duration > 0
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, newNotification.duration);
    }

    return id;
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    console.log("🔕 All notifications cleared");
  }, []);

  // Convenience methods with neon-themed default styling cues
  const success = useCallback((title: string, message = "", duration = 5000) => {
    return addNotification({ type: "success", title, message, duration });
  }, [addNotification]);

  const error = useCallback((title: string, message = "", duration = 0) => {
    // Errors persist by default until dismissed
    return addNotification({ type: "error", title, message, duration });
  }, [addNotification]);

  const warning = useCallback((title: string, message = "", duration = 7000) => {
    return addNotification({ type: "warning", title, message, duration });
  }, [addNotification]);

  const info = useCallback((title: string, message = "", duration = 5000) => {
    return addNotification({ type: "info", title, message, duration });
  }, [addNotification]);

  // Loading toast - persists until manually dismissed or updated
  const loadingNotification = useCallback((title: string, message = "") => {
    return addNotification({ 
      type: "loading", 
      title, 
      message, 
      duration: 0, // Persists indefinitely
      dismissible: false 
    });
  }, [addNotification]);

  // Promise-based helper for async operations
  // Shows loading → success/error automatically
  const promiseNotification = useCallback(async <T,>(
    promise: Promise<T>,
    messages: PromiseMessages
  ): Promise<T> => {
    const id = loadingNotification(messages.loading);
    
    try {
      const result = await promise;
      updateNotification(id, {
        type: "success",
        title: messages.success,
        message: "",
        duration: 5000,
        dismissible: true,
      });
      // Auto-dismiss after success
      setTimeout(() => removeNotification(id), 5000);
      return result;
    } catch (err) {
      updateNotification(id, {
        type: "error",
        title: messages.error,
        message: err instanceof Error ? err.message : "An error occurred",
        duration: 0, // Errors persist
        dismissible: true,
      });
      throw err;
    }
  }, [loadingNotification, updateNotification, removeNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    updateNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    loading: loadingNotification,
    promise: promiseNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Custom hook to access notification context
 * 
 * @throws Error if used outside of NotificationProvider
 * @returns Notification context with state and actions
 * 
 * @example
 * ```tsx
 * const { success, error, notifications } = useNotification();
 * 
 * // Show success toast
 * const handleSave = async () => {
 *   try {
 *     await saveData();
 *     success("Saved!", "Your habit has been created.");
 *   } catch (e) {
 *     error("Error", "Failed to save habit.");
 *   }
 * };
 * ```
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
