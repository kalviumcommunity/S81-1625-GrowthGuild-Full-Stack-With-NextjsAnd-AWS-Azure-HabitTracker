"use client";

import { forwardRef, SelectHTMLAttributes, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * Select Option Interface
 */
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * FormSelect Props Interface
 */
interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  /** Field label text */
  label: string;
  /** Select options */
  options: SelectOption[];
  /** React Hook Form register return */
  register?: UseFormRegisterReturn;
  /** Error message to display */
  error?: string;
  /** Optional icon to display on the left */
  icon?: ReactNode;
  /** Helper text shown below select */
  helperText?: string;
  /** Placeholder option text */
  placeholder?: string;
  /** Container class name */
  containerClassName?: string;
}

/**
 * FormSelect Component
 * 
 * A reusable, accessible select component that integrates with React Hook Form.
 * Features:
 * - Custom styled dropdown
 * - Icon support
 * - Error state styling
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * import { FormSelect } from "@/components/forms";
 * 
 * <FormSelect
 *   label="Category"
 *   options={[
 *     { value: "general", label: "General" },
 *     { value: "support", label: "Support" },
 *   ]}
 *   register={register("category")}
 *   error={errors.category?.message}
 * />
 * ```
 */
const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      register,
      error,
      icon,
      helperText,
      placeholder = "Select an option",
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || register?.name || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

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

        {/* Select Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          {/* Select Field */}
          <select
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`
              w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
              border transition-all duration-200 outline-none
              bg-gray-800/50 text-white
              ${icon ? "pl-12" : ""}
              pr-12
              ${hasError
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              }
              ${className}
            `}
            {...register}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-gray-500 bg-gray-800">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-gray-800 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

FormSelect.displayName = "FormSelect";

export default FormSelect;
