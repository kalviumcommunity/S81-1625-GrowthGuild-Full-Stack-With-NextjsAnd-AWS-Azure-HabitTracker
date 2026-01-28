"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * FormCheckbox Props Interface
 */
interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  /** Checkbox label text */
  label: ReactNode;
  /** React Hook Form register return */
  register?: UseFormRegisterReturn;
  /** Error message to display */
  error?: string;
  /** Helper text shown below checkbox */
  helperText?: string;
  /** Container class name */
  containerClassName?: string;
}

/**
 * FormCheckbox Component
 * 
 * A reusable, accessible checkbox component that integrates with React Hook Form.
 * Features:
 * - Custom styled checkbox
 * - Rich label support (accepts ReactNode)
 * - Error state styling
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * import { FormCheckbox } from "@/components/forms";
 * 
 * <FormCheckbox
 *   label={
 *     <>
 *       I agree to the <a href="/terms">Terms of Service</a>
 *     </>
 *   }
 *   register={register("terms")}
 *   error={errors.terms?.message}
 * />
 * ```
 */
const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      label,
      register,
      error,
      helperText,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || register?.name || "checkbox";
    const hasError = !!error;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {/* Checkbox Container */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              aria-invalid={hasError}
              aria-describedby={
                hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              className={`
                w-5 h-5 rounded border-2 cursor-pointer
                transition-all duration-200
                bg-gray-800/50 
                ${hasError
                  ? "border-red-500/50 focus:ring-red-500/20"
                  : "border-gray-600 focus:ring-cyan-500/20"
                }
                checked:bg-cyan-500 checked:border-cyan-500
                focus:ring-2 focus:outline-none
                ${className}
              `}
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
              }}
              {...register}
              {...props}
            />
          </div>
          <label
            htmlFor={inputId}
            className={`
              ml-3 text-sm cursor-pointer
              ${hasError ? "text-red-400" : "text-gray-300"}
            `}
          >
            {label}
          </label>
        </div>

        {/* Error Message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-400 flex items-center gap-1.5 ml-8"
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
            className="text-sm text-gray-500 ml-8"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
