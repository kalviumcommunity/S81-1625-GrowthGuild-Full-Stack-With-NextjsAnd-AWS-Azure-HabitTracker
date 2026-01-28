"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * FormInput Props Interface
 */
interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  /** Field label text */
  label: string;
  /** React Hook Form register return */
  register?: UseFormRegisterReturn;
  /** Error message to display */
  error?: string;
  /** Optional icon to display on the left */
  icon?: ReactNode;
  /** Helper text shown below input */
  helperText?: string;
  /** Show success state */
  isSuccess?: boolean;
  /** Container class name */
  containerClassName?: string;
}

/**
 * FormInput Component
 * 
 * A reusable, accessible input component that integrates with React Hook Form.
 * Features:
 * - Automatic error state styling
 * - Icon support
 * - Helper text
 * - Success state indicator
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * import { FormInput } from "@/components/forms";
 * 
 * <FormInput
 *   label="Email"
 *   type="email"
 *   register={register("email")}
 *   error={errors.email?.message}
 *   icon={<EmailIcon />}
 * />
 * ```
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      register,
      error,
      icon,
      helperText,
      isSuccess,
      type = "text",
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || register?.name || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;
    const showSuccess = isSuccess && !hasError;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {/* Label */}
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-200"
        >
          {label}
          {props.required && (
            <span className="text-red-400 ml-1" aria-hidden="true">*</span>
          )}
        </label>

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`
              w-full px-4 py-3 rounded-xl
              border transition-all duration-200 outline-none
              bg-gray-800/50 text-white placeholder-gray-500
              ${icon ? "pl-12" : ""}
              ${showSuccess ? "pr-12" : ""}
              ${hasError
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : showSuccess
                ? "border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                : "border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              }
              ${className}
            `}
            {...register}
            {...props}
          />

          {/* Success Indicator */}
          {showSuccess && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-400 flex items-center gap-1.5"
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !hasError && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
