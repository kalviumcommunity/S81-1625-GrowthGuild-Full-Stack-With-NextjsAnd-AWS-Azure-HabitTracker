/**
 * Badge Props Interface
 */
interface BadgeProps {
  /** Badge text content */
  children: React.ReactNode;
  /** Badge color variant */
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Whether badge has a dot indicator */
  dot?: boolean;
  /** Whether badge is pill-shaped */
  pill?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Badge Component
 * 
 * A versatile badge/tag component for displaying status, labels, or counts.
 * 
 * @example
 * ```tsx
 * import { Badge } from "@/components";
 * 
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 * <Badge variant="primary" size="lg">Featured</Badge>
 * ```
 */
export default function Badge({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  pill = true,
  className = "",
}: BadgeProps) {
  // Variant styles - Dark neon theme
  const variantStyles: Record<string, string> = {
    primary: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30",
    info: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
    neutral: "bg-gray-700 text-gray-300 border border-gray-600",
  };

  // Dot color styles - Neon glow
  const dotStyles: Record<string, string> = {
    primary: "bg-cyan-400 shadow-lg shadow-cyan-500/50",
    success: "bg-emerald-400 shadow-lg shadow-emerald-500/50",
    warning: "bg-amber-400 shadow-lg shadow-amber-500/50",
    danger: "bg-red-400 shadow-lg shadow-red-500/50",
    info: "bg-fuchsia-400 shadow-lg shadow-fuchsia-500/50",
    neutral: "bg-gray-400",
  };

  // Size styles
  const sizeStyles: Record<string, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-semibold
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pill ? "rounded-full" : "rounded-md"}
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {dot && (
        <span 
          className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
