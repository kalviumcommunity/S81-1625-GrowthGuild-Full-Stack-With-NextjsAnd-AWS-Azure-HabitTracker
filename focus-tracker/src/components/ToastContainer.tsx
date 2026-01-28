"use client";

import { useNotification, NotificationType } from "@/context/NotificationContext";
import { useState } from "react";

/**
 * Get icon and colors based on notification type
 */
const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case "success":
      return {
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/50",
        textColor: "text-emerald-400",
        iconColor: "text-emerald-400",
        shadowColor: "shadow-emerald-500/20",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case "error":
      return {
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/50",
        textColor: "text-red-400",
        iconColor: "text-red-400",
        shadowColor: "shadow-red-500/20",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case "warning":
      return {
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/50",
        textColor: "text-amber-400",
        iconColor: "text-amber-400",
        shadowColor: "shadow-amber-500/20",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
    case "info":
    default:
      return {
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/50",
        textColor: "text-cyan-400",
        iconColor: "text-cyan-400",
        shadowColor: "shadow-cyan-500/20",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
  }
};

/**
 * Single Toast Notification Item
 */
function ToastItem({
  id,
  type,
  title,
  message,
  dismissible,
  action,
  onDismiss,
}: {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  dismissible?: boolean;
  action?: { label: string; onClick: () => void };
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = getNotificationStyles(type);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={`
        ${styles.bgColor} ${styles.borderColor} ${styles.shadowColor}
        bg-gray-900/95 border rounded-lg p-4 shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
        hover:scale-[1.02] hover:shadow-xl
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.iconColor}`}>
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${styles.textColor}`}>{title}</p>
          {message && (
            <p className="mt-1 text-sm text-gray-400">{message}</p>
          )}
          
          {/* Action button */}
          {action && (
            <button
              onClick={() => {
                action.onClick();
                handleDismiss();
              }}
              className={`mt-2 text-sm font-medium ${styles.textColor} hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible !== false && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ToastContainer Component
 * 
 * Renders all active notifications as toast messages.
 * Position: Fixed to top-right corner.
 * 
 * @example
 * ```tsx
 * // Add to your layout (already included in RootLayout)
 * <ToastContainer />
 * 
 * // Trigger notifications from any component
 * const { success, error } = useNotification();
 * success("Saved!", "Your habit was created successfully.");
 * ```
 */
export default function ToastContainer() {
  const { notifications, removeNotification } = useNotification();

  // Don't render if no notifications
  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          {...notification}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
}
