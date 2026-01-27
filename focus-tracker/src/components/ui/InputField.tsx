import React, { forwardRef } from "react";

/**
 * InputField Props Interface
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Left icon/addon */
  leftIcon?: React.ReactNode;
  /** Right icon/addon */
  rightIcon?: React.ReactNode;
  /** Input variant */
  variant?: "default" | "filled" | "outlined";
  /** Full width */
  fullWidth?: boolean;
  /** Container class name */
  containerClassName?: string;
}

/**
 * InputField Component
 * 
 * A reusable, accessible input field component with label, validation,
 * helper text, and icon support.
 * 
 * @example
 * ```tsx
 * import { InputField } from "@/components";
 * 
 * // Basic usage
 * <InputField label="Email" type="email" placeholder="Enter your email" />
 * 
 * // With error
 * <InputField label="Password" type="password" error="Password is required" />
 * 
 * // With icons
 * <InputField 
 *   label="Search" 
 *   leftIcon={<SearchIcon />} 
 *   placeholder="Search habits..."
 * />
 * ```
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      fullWidth = true,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input styles
    const baseInputStyles = `
      w-full rounded-xl
      text-white
      placeholder-gray-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    // Variant styles
    const variantStyles: Record<string, string> = {
      default: `
        bg-gray-800
        border border-gray-700
        focus:border-cyan-500 focus:ring-cyan-500/20
        hover:border-gray-600
      `,
      filled: `
        bg-gray-700
        border-2 border-transparent
        focus:bg-gray-800
        focus:border-cyan-500 focus:ring-cyan-500/20
      `,
      outlined: `
        bg-transparent
        border-2 border-gray-600
        focus:border-cyan-500 focus:ring-cyan-500/20
        hover:border-cyan-400/50
      `,
    };

    // Error styles
    const errorStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "";

    // Padding based on icons
    const paddingStyles = `
      ${leftIcon ? "pl-11" : "pl-4"}
      ${rightIcon ? "pr-11" : "pr-4"}
      py-3
    `;

    const combinedInputStyles = `
      ${baseInputStyles}
      ${variantStyles[variant]}
      ${errorStyles}
      ${paddingStyles}
      ${className}
    `.trim().replace(/\s+/g, " ");

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={combinedInputStyles}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error 
                ? `${inputId}-error` 
                : helperText 
                  ? `${inputId}-helper` 
                  : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;

/**
 * TextArea Component
 * 
 * A reusable textarea component with similar styling to InputField.
 */
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = true,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = `
      w-full rounded-xl px-4 py-3
      bg-gray-800
      border border-gray-700
      text-white
      placeholder-gray-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500
      hover:border-gray-600
      disabled:opacity-50 disabled:cursor-not-allowed
      resize-none
    `;

    const errorStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "";

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${errorStyles} ${className}`.trim().replace(/\s+/g, " ")}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
