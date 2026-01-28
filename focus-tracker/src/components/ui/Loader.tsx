"use client";

/**
 * Spinner Size Options
 */
type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Spinner Color Options
 */
type SpinnerColor = "cyan" | "emerald" | "fuchsia" | "amber" | "red" | "white";

/**
 * Spinner Props Interface
 */
interface SpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color theme */
  color?: SpinnerColor;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Size mappings for spinner
 */
const sizeMap: Record<SpinnerSize, string> = {
  xs: "w-4 h-4 border-2",
  sm: "w-6 h-6 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
  xl: "w-16 h-16 border-4",
};

/**
 * Color mappings for spinner
 */
const colorMap: Record<SpinnerColor, string> = {
  cyan: "border-cyan-500 border-t-transparent",
  emerald: "border-emerald-500 border-t-transparent",
  fuchsia: "border-fuchsia-500 border-t-transparent",
  amber: "border-amber-500 border-t-transparent",
  red: "border-red-500 border-t-transparent",
  white: "border-white border-t-transparent",
};

/**
 * Spinner Component
 * 
 * A simple animated loading spinner with customizable size and color.
 * 
 * @example
 * ```tsx
 * <Spinner size="md" color="cyan" />
 * <Spinner size="lg" color="emerald" />
 * ```
 */
export function Spinner({ size = "md", color = "cyan", className = "" }: SpinnerProps) {
  return (
    <div
      className={`
        ${sizeMap[size]}
        ${colorMap[color]}
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Inline Loader Props
 */
interface InlineLoaderProps {
  /** Text to display next to spinner */
  text?: string;
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color theme */
  color?: SpinnerColor;
  /** Additional CSS classes */
  className?: string;
}

/**
 * InlineLoader Component
 * 
 * A horizontal loader with text, ideal for inline feedback.
 * 
 * @example
 * ```tsx
 * <InlineLoader text="Saving..." />
 * <InlineLoader text="Loading data" size="sm" color="emerald" />
 * ```
 */
export function InlineLoader({
  text = "Loading...",
  size = "sm",
  color = "cyan",
  className = "",
}: InlineLoaderProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} color={color} />
      <span className="text-gray-400 text-sm">{text}</span>
    </div>
  );
}

/**
 * Full Page Loader Props
 */
interface FullPageLoaderProps {
  /** Text to display */
  text?: string;
  /** Whether to show transparent overlay or solid background */
  overlay?: boolean;
  /** Color theme */
  color?: SpinnerColor;
}

/**
 * FullPageLoader Component
 * 
 * A full-screen loading overlay for blocking operations.
 * 
 * @example
 * ```tsx
 * {isLoading && <FullPageLoader text="Processing..." />}
 * {isLoading && <FullPageLoader overlay text="Please wait..." />}
 * ```
 */
export function FullPageLoader({
  text = "Loading...",
  overlay = true,
  color = "cyan",
}: FullPageLoaderProps) {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        ${overlay ? "bg-gray-900/80 backdrop-blur-sm" : "bg-gray-900"}
      `}
      role="status"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-800/50 border border-gray-700">
        <Spinner size="xl" color={color} />
        <p className="text-gray-300 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
}

/**
 * Button Loader Props
 */
interface ButtonLoaderProps {
  /** Size of the spinner */
  size?: "xs" | "sm";
  /** Color (typically white for buttons) */
  color?: SpinnerColor;
}

/**
 * ButtonLoader Component
 * 
 * A small spinner designed for use inside buttons.
 * 
 * @example
 * ```tsx
 * <button disabled={isLoading}>
 *   {isLoading ? <ButtonLoader /> : "Submit"}
 * </button>
 * ```
 */
export function ButtonLoader({ size = "xs", color = "white" }: ButtonLoaderProps) {
  return <Spinner size={size} color={color} />;
}

/**
 * Progress Bar Props
 */
interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Color theme */
  color?: SpinnerColor;
  /** Height variant */
  height?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Animation style */
  animated?: boolean;
}

/**
 * Height mappings
 */
const heightMap: Record<string, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

/**
 * Progress bar color mappings
 */
const progressColorMap: Record<SpinnerColor, string> = {
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  fuchsia: "bg-fuchsia-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  white: "bg-white",
};

/**
 * ProgressBar Component
 * 
 * A horizontal progress indicator for upload/download operations.
 * 
 * @example
 * ```tsx
 * <ProgressBar value={65} showLabel />
 * <ProgressBar value={uploadProgress} color="emerald" animated />
 * ```
 */
export function ProgressBar({
  value,
  showLabel = false,
  color = "cyan",
  height = "md",
  className = "",
  animated = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${heightMap[height]}`}>
        <div
          className={`
            ${progressColorMap[color]} ${heightMap[height]} rounded-full
            transition-all duration-300 ease-out
            ${animated ? "relative overflow-hidden" : ""}
          `}
          style={{ width: `${clampedValue}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Loader Props
 */
interface SkeletonProps {
  /** Width (CSS value or Tailwind class) */
  width?: string;
  /** Height (CSS value or Tailwind class) */
  height?: string;
  /** Shape variant */
  variant?: "text" | "rectangular" | "circular" | "rounded";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton Component
 * 
 * A placeholder loading animation for content that's being fetched.
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" width="200px" />
 * <Skeleton variant="circular" width="40px" height="40px" />
 * <Skeleton variant="rectangular" height="200px" />
 * ```
 */
export function Skeleton({
  width = "100%",
  height = "20px",
  variant = "text",
  className = "",
}: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    text: "rounded",
    rectangular: "rounded-none",
    circular: "rounded-full",
    rounded: "rounded-xl",
  };

  return (
    <div
      className={`
        bg-gray-700/50 animate-pulse
        ${variantStyles[variant]}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Card Skeleton Component
 * 
 * A pre-built skeleton for card-shaped content.
 */
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-gray-800/50 border border-gray-700 rounded-xl ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height="20px" className="mb-2" />
          <Skeleton variant="text" width="40%" height="16px" />
        </div>
      </div>
      <Skeleton variant="text" height="16px" className="mb-2" />
      <Skeleton variant="text" height="16px" className="mb-2" />
      <Skeleton variant="text" width="80%" height="16px" />
    </div>
  );
}

/**
 * List Skeleton Component
 * 
 * A pre-built skeleton for list items.
 */
export function ListSkeleton({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1">
            <Skeleton variant="text" width="70%" height="18px" className="mb-2" />
            <Skeleton variant="text" width="50%" height="14px" />
          </div>
          <Skeleton variant="rounded" width="80px" height="32px" />
        </div>
      ))}
    </div>
  );
}

/**
 * Dots Loader Component
 * 
 * Three bouncing dots animation.
 */
export function DotsLoader({ color = "cyan", className = "" }: { color?: SpinnerColor; className?: string }) {
  const dotColor = progressColorMap[color];
  
  return (
    <div className={`flex items-center gap-1 ${className}`} role="status" aria-label="Loading">
      <div className={`w-2 h-2 rounded-full ${dotColor} animate-bounce`} style={{ animationDelay: "0ms" }} />
      <div className={`w-2 h-2 rounded-full ${dotColor} animate-bounce`} style={{ animationDelay: "150ms" }} />
      <div className={`w-2 h-2 rounded-full ${dotColor} animate-bounce`} style={{ animationDelay: "300ms" }} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Pulse Loader Component
 * 
 * A pulsing circle animation.
 */
export function PulseLoader({ size = "md", color = "cyan", className = "" }: SpinnerProps) {
  const sizeStyles: Record<SpinnerSize, string> = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  return (
    <div className={`relative ${sizeStyles[size]} ${className}`} role="status" aria-label="Loading">
      <div className={`absolute inset-0 rounded-full ${progressColorMap[color]} opacity-75 animate-ping`} />
      <div className={`absolute inset-0 rounded-full ${progressColorMap[color]}`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
