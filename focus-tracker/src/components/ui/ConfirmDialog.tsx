"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { ButtonLoader } from "./Loader";

/**
 * Confirm Dialog Variant Types
 */
type DialogVariant = "danger" | "warning" | "info" | "success";

/**
 * Confirm Dialog Props Interface
 */
interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when user confirms */
  onConfirm: () => void | Promise<void>;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Text for confirm button */
  confirmText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** Visual variant affecting colors */
  variant?: DialogVariant;
  /** Icon to display (optional, auto-selected based on variant if not provided) */
  icon?: React.ReactNode;
  /** Whether the confirm action is in progress */
  isLoading?: boolean;
  /** Whether confirm button should be disabled */
  confirmDisabled?: boolean;
}

/**
 * Variant styling configurations
 */
const variantStyles: Record<DialogVariant, {
  iconBg: string;
  iconColor: string;
  confirmBg: string;
  confirmHover: string;
  confirmBorder: string;
  confirmShadow: string;
}> = {
  danger: {
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    confirmBg: "bg-red-600",
    confirmHover: "hover:bg-red-500",
    confirmBorder: "border-red-500/30",
    confirmShadow: "shadow-red-500/20",
  },
  warning: {
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    confirmBg: "bg-amber-600",
    confirmHover: "hover:bg-amber-500",
    confirmBorder: "border-amber-500/30",
    confirmShadow: "shadow-amber-500/20",
  },
  info: {
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    confirmBg: "bg-cyan-600",
    confirmHover: "hover:bg-cyan-500",
    confirmBorder: "border-cyan-500/30",
    confirmShadow: "shadow-cyan-500/20",
  },
  success: {
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    confirmBg: "bg-emerald-600",
    confirmHover: "hover:bg-emerald-500",
    confirmBorder: "border-emerald-500/30",
    confirmShadow: "shadow-emerald-500/20",
  },
};

/**
 * Default icons for each variant
 */
const defaultIcons: Record<DialogVariant, React.ReactNode> = {
  danger: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

/**
 * ConfirmDialog Component
 * 
 * An accessible confirmation dialog for blocking user actions.
 * Features:
 * - Focus trapping within dialog
 * - Escape key to close
 * - ARIA attributes for screen readers
 * - Auto-focus on cancel button (safer default)
 * - Loading state for async confirmations
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [isDeleting, setIsDeleting] = useState(false);
 * 
 * const handleDelete = async () => {
 *   setIsDeleting(true);
 *   await deleteItem(id);
 *   setIsDeleting(false);
 *   setIsOpen(false);
 * };
 * 
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item?"
 *   message="This action cannot be undone."
 *   variant="danger"
 *   isLoading={isDeleting}
 * />
 * ```
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  icon,
  isLoading = false,
  confirmDisabled = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const styles = variantStyles[variant];
  const displayIcon = icon || defaultIcons[variant];

  /**
   * Handle keyboard events for accessibility
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) {
      onClose();
      return;
    }

    // Focus trapping
    if (e.key === "Tab" && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [isLoading, onClose]);

  /**
   * Setup keyboard listeners and focus management
   */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      
      // Focus the cancel button by default (safer action)
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  /**
   * Handle confirm with loading state
   */
  const handleConfirm = async () => {
    if (isLoading || confirmDisabled) return;
    await onConfirm();
  };

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={`
          relative bg-gray-900 border border-gray-700
          rounded-2xl shadow-xl ${styles.confirmShadow}
          w-full max-w-md
          animate-fade-in-up
        `}
      >
        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <span className={styles.iconColor}>{displayIcon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-semibold text-white"
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-description"
                className="mt-2 text-sm text-gray-400"
              >
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              ref={cancelButtonRef}
              onClick={onClose}
              disabled={isLoading}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium
                bg-gray-800 text-gray-300 border border-gray-700
                hover:bg-gray-700 hover:text-white
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              disabled={isLoading || confirmDisabled}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium
                ${styles.confirmBg} ${styles.confirmHover}
                text-white border ${styles.confirmBorder}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                min-w-[100px] flex items-center justify-center gap-2
              `}
            >
              {isLoading ? (
                <>
                  <ButtonLoader />
                  <span>Processing...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * useConfirmDialog Hook
 * 
 * A convenience hook for managing confirm dialog state.
 * 
 * @example
 * ```tsx
 * const { isOpen, openDialog, closeDialog, confirm } = useConfirmDialog();
 * 
 * const handleDelete = () => {
 *   openDialog();
 * };
 * 
 * const handleConfirm = async () => {
 *   await deleteItem();
 *   closeDialog();
 * };
 * 
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={closeDialog}
 *   onConfirm={handleConfirm}
 *   ...
 * />
 * ```
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState<any>(null);

  const openDialog = useCallback((dialogData?: any) => {
    setData(dialogData);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return {
    isOpen,
    data,
    openDialog,
    closeDialog,
  };
}
