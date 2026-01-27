import React from "react";

/**
 * Card Props Interface
 */
interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card subtitle or description */
  subtitle?: string;
  /** Icon or emoji to display */
  icon?: React.ReactNode;
  /** Card variant style */
  variant?: "default" | "stat" | "glass" | "gradient";
  /** Hover effect enabled */
  hoverable?: boolean;
  /** Optional header action */
  headerAction?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Custom padding */
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Card Component
 * 
 * A versatile card component for displaying content in a contained, styled box.
 * Supports multiple variants for different use cases.
 * 
 * @example
 * ```tsx
 * import { Card } from "@/components";
 * 
 * // Basic card
 * <Card title="My Card">
 *   <p>Card content here</p>
 * </Card>
 * 
 * // Stat card with icon
 * <Card variant="stat" icon="📊" title="Total Habits" subtitle="Active tracking">
 *   <span className="text-3xl font-bold">24</span>
 * </Card>
 * 
 * // Glass card with hover effect
 * <Card variant="glass" hoverable onClick={handleClick}>
 *   <p>Interactive card</p>
 * </Card>
 * ```
 */
export default function Card({
  children,
  title,
  subtitle,
  icon,
  variant = "default",
  hoverable = false,
  headerAction,
  footer,
  className = "",
  onClick,
  padding = "md",
}: CardProps) {
  // Base styles
  const baseStyles = "rounded-2xl transition-all duration-300";

  // Variant styles
  const variantStyles: Record<string, string> = {
    default: `
      bg-gray-900/80
      border border-gray-700
      shadow-sm
    `,
    stat: `
      bg-gray-900/80
      border border-gray-700
      shadow-sm
    `,
    glass: `
      bg-gray-900/60
      backdrop-blur-xl
      border border-gray-700/50
      shadow-lg
    `,
    gradient: `
      bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10
      border border-cyan-500/30
    `,
  };

  // Padding styles
  const paddingStyles: Record<string, string> = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Hover styles
  const hoverStyles = hoverable
    ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50"
    : "";

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${className}
  `.trim().replace(/\s+/g, " ");

  const CardWrapper = onClick ? "button" : "div";

  return (
    <CardWrapper
      className={combinedStyles}
      onClick={onClick}
      {...(onClick && { type: "button" as const })}
    >
      {/* Card Header */}
      {(title || icon || headerAction) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-2xl flex-shrink-0" aria-hidden="true">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="card-content">{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </CardWrapper>
  );
}

/**
 * StatCard Component
 * 
 * A specialized card for displaying statistics with value, label, and optional trend.
 */
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color?: "indigo" | "emerald" | "amber" | "red" | "cyan";
  className?: string;
}

export function StatCard({ 
  value, 
  label, 
  icon, 
  trend, 
  color = "indigo",
  className = "" 
}: StatCardProps) {
  const colorStyles: Record<string, string> = {
    indigo: "from-indigo-500 to-purple-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-pink-500",
    cyan: "from-cyan-500 to-blue-500",
  };

  return (
    <Card variant="stat" className={`relative overflow-hidden ${className}`}>
      {/* Background gradient accent */}
      <div 
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorStyles[color]} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
        aria-hidden="true"
      />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.direction === "up" 
                ? "text-emerald-600" 
                : "text-red-600"
            }`}>
              <svg 
                className={`w-4 h-4 mr-1 ${trend.direction === "down" ? "rotate-180" : ""}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-2xl text-white shadow-lg`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
