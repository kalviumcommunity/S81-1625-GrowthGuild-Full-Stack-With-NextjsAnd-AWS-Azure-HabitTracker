"use client";

import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import {
  Spinner,
  InlineLoader,
  FullPageLoader,
  ButtonLoader,
  ProgressBar,
  CardSkeleton,
  ListSkeleton,
  DotsLoader,
  PulseLoader,
  ConfirmDialog,
  useConfirmDialog,
  Button,
} from "@/components/ui";

/**
 * Feedback Demo Page
 * 
 * Demonstrates all feedback UI elements:
 * - Toast notifications (instant feedback)
 * - Modal dialogs (blocking feedback)
 * - Loaders/Spinners (process feedback)
 * 
 * Shows the complete flow: Toast → Modal → Loader → Toast (Success/Error)
 */
export default function FeedbackDemoPage() {
  const { success, error, warning, info, loading, promise, removeNotification, clearAllNotifications } = useNotification();
  
  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dialog states
  const deleteDialog = useConfirmDialog();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Item to delete
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // ============================================
  // Toast Notification Demos
  // ============================================
  
  const handleSuccessToast = () => {
    success("Success!", "Your action was completed successfully.");
  };

  const handleErrorToast = () => {
    error("Error!", "Something went wrong. Please try again.");
  };

  const handleWarningToast = () => {
    warning("Warning!", "This action may have consequences.");
  };

  const handleInfoToast = () => {
    info("Information", "Here's some helpful information.");
  };

  const handleLoadingToast = () => {
    const id = loading("Processing...", "Please wait while we process your request.");
    
    // Simulate async operation
    setTimeout(() => {
      removeNotification(id);
      success("Done!", "Processing completed successfully.");
    }, 3000);
  };

  // Promise-based loading toast
  const handlePromiseToast = async () => {
    const fakeApiCall = () => new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3 ? resolve() : reject(new Error("Random failure"));
      }, 2000);
    });

    try {
      await promise(fakeApiCall(), {
        loading: "Saving data...",
        success: "Data saved successfully!",
        error: "Failed to save data",
      });
    } catch {
      // Error already handled by promise helper
    }
  };

  // ============================================
  // Modal Dialog Demos
  // ============================================

  const handleOpenDeleteDialog = (itemName: string) => {
    setItemToDelete(itemName);
    deleteDialog.openDialog();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsDeleting(false);
    deleteDialog.closeDialog();
    success("Deleted!", `"${itemToDelete}" has been permanently deleted.`);
    setItemToDelete(null);
  };

  // ============================================
  // Loader Demos
  // ============================================

  const handleFullPageLoader = () => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
      success("Loaded!", "Page content loaded successfully.");
    }, 3000);
  };

  const handleUploadSimulation = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          success("Upload Complete!", "Your file has been uploaded.");
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleButtonWithLoader = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaving(false);
    success("Saved!", "Changes saved successfully.");
  };

  // ============================================
  // Complete User Flow Demo
  // ============================================

  const handleCompleteFlow = async () => {
    // Step 1: Show info toast
    info("Starting process...", "Preparing to save your data.");
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Step 2: Show confirmation modal
    deleteDialog.openDialog();
  };

  const handleCompleteFlowConfirm = async () => {
    setIsDeleting(true);
    
    // Step 3: Show loading state
    const loadingId = loading("Processing...", "Please wait...");
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Step 4: Complete with success
    removeNotification(loadingId);
    setIsDeleting(false);
    deleteDialog.closeDialog();
    success("Complete!", "The entire flow completed successfully.");
  };

  return (
    <div className="space-y-8 p-6">
      {/* Full Page Loader */}
      {isPageLoading && <FullPageLoader text="Loading page content..." />}

      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-cyan-400">🔔</span> Feedback UI Demo
        </h1>
        <p className="text-gray-400">
          Interactive demonstration of toasts, modals, and loaders for user feedback.
        </p>
      </div>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card card-dark p-4 border-l-4 border-emerald-500">
          <h3 className="font-semibold text-emerald-400 mb-1">Instant Feedback</h3>
          <p className="text-sm text-gray-400">Toast / Snackbar notifications</p>
          <p className="text-xs text-gray-500 mt-1">&quot;Item added&quot;, &quot;Saved successfully&quot;</p>
        </div>
        <div className="card card-dark p-4 border-l-4 border-amber-500">
          <h3 className="font-semibold text-amber-400 mb-1">Blocking Feedback</h3>
          <p className="text-sm text-gray-400">Modal / Dialog confirmations</p>
          <p className="text-xs text-gray-500 mt-1">&quot;Are you sure you want to delete?&quot;</p>
        </div>
        <div className="card card-dark p-4 border-l-4 border-purple-500">
          <h3 className="font-semibold text-purple-400 mb-1">Process Feedback</h3>
          <p className="text-sm text-gray-400">Loader / Spinner / Progress</p>
          <p className="text-xs text-gray-500 mt-1">&quot;Uploading... please wait&quot;</p>
        </div>
      </div>

      {/* Toast Notifications Section */}
      <section className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🍞</span> Toast Notifications
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Non-blocking notifications that appear briefly to inform users of actions.
          Each has <code className="text-cyan-400">role=&quot;alert&quot;</code> for accessibility.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSuccessToast}
            className="px-4 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
          >
            ✓ Success Toast
          </button>
          <button
            onClick={handleErrorToast}
            className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all"
          >
            ✕ Error Toast
          </button>
          <button
            onClick={handleWarningToast}
            className="px-4 py-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition-all"
          >
            ⚠ Warning Toast
          </button>
          <button
            onClick={handleInfoToast}
            className="px-4 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
          >
            ℹ Info Toast
          </button>
          <button
            onClick={handleLoadingToast}
            className="px-4 py-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30 hover:bg-purple-500/30 transition-all"
          >
            ⏳ Loading Toast
          </button>
          <button
            onClick={handlePromiseToast}
            className="px-4 py-2.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl border border-fuchsia-500/30 hover:bg-fuchsia-500/30 transition-all"
          >
            🎯 Promise Toast
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2.5 bg-gray-700 text-gray-300 rounded-xl border border-gray-600 hover:bg-gray-600 transition-all"
          >
            Clear All
          </button>
        </div>

        {/* Code Example */}
        <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Usage Example:</p>
          <pre className="text-sm text-gray-300 overflow-x-auto">
{`const { success, error, loading, promise } = useNotification();

// Simple toast
success("Saved!", "Your changes have been saved.");

// Loading toast (manual)
const id = loading("Saving...");
await saveData();
removeNotification(id);
success("Done!");

// Promise-based (automatic)
await promise(saveData(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save"
});`}
          </pre>
        </div>
      </section>

      {/* Modal Dialogs Section */}
      <section className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🪟</span> Modal Dialogs
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Blocking dialogs that require user action before continuing.
          Features focus trapping, Escape to close, and ARIA attributes.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleOpenDeleteDialog("Important Document")}
            className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all"
          >
            🗑️ Delete Confirmation
          </button>
          <button
            onClick={() => {
              setItemToDelete("Complete Flow");
              deleteDialog.openDialog();
            }}
            className="px-4 py-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition-all"
          >
            ⚠️ Warning Dialog
          </button>
        </div>

        {/* Features List */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400">✓</span>
            <div>
              <p className="text-sm text-white">Focus Trapping</p>
              <p className="text-xs text-gray-500">Tab stays within modal</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400">✓</span>
            <div>
              <p className="text-sm text-white">Escape to Close</p>
              <p className="text-xs text-gray-500">Press Esc to dismiss</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400">✓</span>
            <div>
              <p className="text-sm text-white">ARIA Attributes</p>
              <p className="text-xs text-gray-500">role=&quot;alertdialog&quot;, aria-modal</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400">✓</span>
            <div>
              <p className="text-sm text-white">Loading State</p>
              <p className="text-xs text-gray-500">Button shows spinner during action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Loaders Section */}
      <section className="card card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">⏳</span> Loaders & Progress
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Visual indicators for async operations. All include <code className="text-cyan-400">role=&quot;status&quot;</code> and <code className="text-cyan-400">aria-live</code> for screen readers.
        </p>

        {/* Spinner Variants */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Spinner Variants</h3>
          <div className="flex flex-wrap items-end gap-6">
            <div className="text-center">
              <Spinner size="xs" />
              <p className="text-xs text-gray-500 mt-2">xs</p>
            </div>
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500 mt-2">sm</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-xs text-gray-500 mt-2">md</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" color="emerald" />
              <p className="text-xs text-gray-500 mt-2">lg</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" color="fuchsia" />
              <p className="text-xs text-gray-500 mt-2">xl</p>
            </div>
          </div>
        </div>

        {/* Alternative Loaders */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Alternative Loaders</h3>
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-center">
              <DotsLoader />
              <p className="text-xs text-gray-500 mt-2">Dots</p>
            </div>
            <div className="text-center">
              <PulseLoader size="md" color="emerald" />
              <p className="text-xs text-gray-500 mt-2">Pulse</p>
            </div>
            <div>
              <InlineLoader text="Loading..." />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Progress Bar</h3>
          <div className="space-y-4">
            <ProgressBar value={uploadProgress} showLabel color="cyan" animated />
            <button
              onClick={handleUploadSimulation}
              disabled={isUploading}
              className="px-4 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "📤 Simulate Upload"}
            </button>
          </div>
        </div>

        {/* Full Page & Button Loaders */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Page & Button Loaders</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleFullPageLoader}
              className="px-4 py-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30 hover:bg-purple-500/30 transition-all"
            >
              🖥️ Full Page Loader
            </button>
            <button
              onClick={handleButtonWithLoader}
              disabled={isSaving}
              className="px-4 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-50 min-w-[140px] flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <ButtonLoader color="emerald" />
                  <span>Saving...</span>
                </>
              ) : (
                "💾 Save Button"
              )}
            </button>
          </div>
        </div>

        {/* Skeleton Loaders */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-4">Skeleton Loaders</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-2">Card Skeleton</p>
              <CardSkeleton />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">List Skeleton</p>
              <ListSkeleton count={2} />
            </div>
          </div>
        </div>
      </section>

      {/* Complete Flow Demo */}
      <section className="card card-dark p-6 border border-cyan-500/30">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🔄</span> Complete User Flow
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Demonstrates the recommended feedback pattern: <br />
          <span className="text-cyan-400">Toast</span> → <span className="text-amber-400">Modal</span> → <span className="text-purple-400">Loader</span> → <span className="text-emerald-400">Toast (Success/Error)</span>
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">1</span>
            <span className="text-gray-400">Info Toast</span>
          </div>
          <span className="text-gray-600">→</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">2</span>
            <span className="text-gray-400">Confirm Modal</span>
          </div>
          <span className="text-gray-600">→</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">3</span>
            <span className="text-gray-400">Loading</span>
          </div>
          <span className="text-gray-600">→</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">4</span>
            <span className="text-gray-400">Success</span>
          </div>
        </div>

        <Button
          label="▶️ Run Complete Flow"
          onClick={handleCompleteFlow}
          className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400"
        />
      </section>

      {/* Accessibility Notes */}
      <section className="card card-dark p-6 bg-gray-800/50">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">♿</span> Accessibility Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">•</span>
              <p className="text-gray-300"><strong>ARIA Roles:</strong> <code className="text-xs bg-gray-700 px-1 rounded">role=&quot;alert&quot;</code>, <code className="text-xs bg-gray-700 px-1 rounded">role=&quot;alertdialog&quot;</code>, <code className="text-xs bg-gray-700 px-1 rounded">role=&quot;status&quot;</code></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">•</span>
              <p className="text-gray-300"><strong>Live Regions:</strong> <code className="text-xs bg-gray-700 px-1 rounded">aria-live=&quot;polite&quot;</code> for non-urgent, <code className="text-xs bg-gray-700 px-1 rounded">aria-live=&quot;assertive&quot;</code> for urgent</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">•</span>
              <p className="text-gray-300"><strong>Focus Management:</strong> Focus trapped in modals, auto-focus on safe actions</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">•</span>
              <p className="text-gray-300"><strong>Keyboard Navigation:</strong> Escape to close, Tab for focus cycling</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">•</span>
              <p className="text-gray-300"><strong>Screen Reader:</strong> <code className="text-xs bg-gray-700 px-1 rounded">sr-only</code> text for loaders</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">•</span>
              <p className="text-gray-300"><strong>Labels:</strong> <code className="text-xs bg-gray-700 px-1 rounded">aria-labelledby</code>, <code className="text-xs bg-gray-700 px-1 rounded">aria-describedby</code> on dialogs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.closeDialog}
        onConfirm={itemToDelete === "Complete Flow" ? handleCompleteFlowConfirm : handleConfirmDelete}
        title={itemToDelete === "Complete Flow" ? "Confirm Action?" : "Delete Item?"}
        message={
          itemToDelete === "Complete Flow"
            ? "This will demonstrate the complete feedback flow with loading states."
            : `Are you sure you want to delete "${itemToDelete}"? This action cannot be undone.`
        }
        confirmText={itemToDelete === "Complete Flow" ? "Continue" : "Delete"}
        variant={itemToDelete === "Complete Flow" ? "warning" : "danger"}
        isLoading={isDeleting}
      />
    </div>
  );
}
