"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * FormTextarea Props Interface
 */
interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  /** Field label text */
  label: string;
  /** React Hook Form register return */
  register?: UseFormRegisterReturn;
  /** Error message to display */
  error?: string;
  /** Helper text shown below textarea */
  helperText?: string;
  /** Show character count */
  showCharCount?: boolean;
  /** Maximum characters (for display) */
  maxLength?: number;
  /** Current value (for character count) */
  currentLength?: number;
  /** Container class name */
  containerClassName?: string;
}

/**
 * FormTextarea Component
 * 
 * A reusable, accessible textarea component that integrates with React Hook Form.
 * Features:
 * - Character count display
 * - Auto-resize option
 * - Error state styling
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * import { FormTextarea } from "@/components/forms";
 * 
 * <FormTextarea
 *   label="Message"
 *   register={register("message")}
 *   error={errors.message?.message}
 *   showCharCount
 *   maxLength={500}
 *   currentLength={watch("message")?.length || 0}
 * />
 * ```
 */
const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      register,
      error,
      helperText,
      showCharCount,
      maxLength,
      currentLength = 0,
      className = "",
      containerClassName = "",
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || register?.name || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;
    const isNearLimit = maxLength && currentLength > maxLength * 0.9;
    const isOverLimit = maxLength && currentLength > maxLength;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {/* Label */}
        <div className="flex justify-between items-center">
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-200"
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1" aria-hidden="true">*</span>
            )}
          </label>

          {/* Character Count */}
          {showCharCount && maxLength && (
            <span
              className={`text-xs transition-colors ${
                isOverLimit
                  ? "text-red-400"
                  : isNearLimit
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        {/* Textarea Field */}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`
            w-full px-4 py-3 rounded-xl resize-y min-h-[100px]
            border transition-all duration-200 outline-none
            bg-gray-800/50 text-white placeholder-gray-500
            ${hasError
              ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            }
            ${className}
          `}
          {...register}
          {...props}
        />

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

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
