import React from "react";

/**
 * Button Variants
 */
type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

/**
 * Button Sizes
 */
type ButtonSize = "sm" | "md" | "lg";

/**
 * Button Props Interface
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text content */
  label?: string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Children elements (alternative to label) */
  children?: React.ReactNode;
}

/**
 * Button Component
 * 
 * A highly reusable button component with multiple variants, sizes, and states.
 * Supports loading states, icons, and full accessibility.
 * 
 * @example
 * ```tsx
 * import { Button } from "@/components";
 * 
 * // Basic usage
 * <Button label="Click Me" onClick={handleClick} />
 * 
 * // With variant
 * <Button variant="secondary" label="Cancel" />
 * 
 * // With loading state
 * <Button loading label="Saving..." />
 * 
 * // With icons
 * <Button leftIcon={<PlusIcon />} label="Add Item" />
 * ```
 */
export default function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Variant styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-fuchsia-600
      text-white
      hover:from-cyan-600 hover:to-fuchsia-700
      hover:shadow-lg hover:shadow-cyan-500/30
      focus:ring-cyan-500
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-transparent
      text-cyan-400
      border-2 border-cyan-500/50
      hover:bg-cyan-500/10 hover:border-cyan-400
      focus:ring-cyan-500
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white
      hover:from-red-600 hover:to-red-700
      hover:shadow-lg hover:shadow-red-500/30
      focus:ring-red-500
      hover:-translate-y-0.5
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-green-600
      text-white
      hover:from-emerald-600 hover:to-green-700
      hover:shadow-lg hover:shadow-emerald-500/30
      focus:ring-emerald-500
      hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent
      text-gray-400
      hover:bg-gray-800 hover:text-gray-200
      focus:ring-gray-500
    `,
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
  };

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim().replace(/\s+/g, " ");

  return (
    <button
      className={combinedStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
      {label || children}
      {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}
