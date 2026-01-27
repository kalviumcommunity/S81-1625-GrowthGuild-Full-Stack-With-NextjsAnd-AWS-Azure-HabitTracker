/**
 * Context Barrel Export
 * 
 * This file exports all contexts from a single entry point,
 * making imports cleaner throughout the application.
 * 
 * @example
 * ```tsx
 * import { AuthProvider, UIProvider, NotificationProvider } from '@/context';
 * import type { User, Notification, NotificationType } from '@/context';
 * ```
 */

// Authentication Context
export { AuthProvider, useAuth } from "./AuthContext";
export type { User, AuthContextType } from "./AuthContext";

// UI Context
export { UIProvider, useUIContext } from "./UIContext";

// Notification Context
export { NotificationProvider, useNotification } from "./NotificationContext";
export type { Notification, NotificationType } from "./NotificationContext";
