"use client";

import { useMemo } from "react";

/**
 * Password Strength Calculator Props
 */
interface PasswordStrengthProps {
  /** The password to evaluate */
  password: string;
  /** Show strength label */
  showLabel?: boolean;
  /** Container class name */
  className?: string;
}

/**
 * Password Strength Level
 */
interface StrengthLevel {
  strength: number;
  label: string;
  color: string;
  textColor: string;
}

/**
 * PasswordStrength Component
 * 
 * Displays a visual indicator of password strength with helpful feedback.
 * Evaluates based on:
 * - Length
 * - Uppercase letters
 * - Lowercase letters
 * - Numbers
 * - Special characters
 * 
 * @example
 * ```tsx
 * import { PasswordStrength } from "@/components/forms";
 * 
 * <PasswordStrength password={watch("password")} showLabel />
 * ```
 */
export default function PasswordStrength({
  password,
  showLabel = true,
  className = "",
}: PasswordStrengthProps) {
  const strengthLevel = useMemo((): StrengthLevel => {
    if (!password || password.length === 0) {
      return { strength: 0, label: "", color: "bg-gray-700", textColor: "text-gray-500" };
    }

    let score = 0;

    // Length checks
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Map score to strength level
    if (score <= 2) {
      return { strength: 20, label: "Very Weak", color: "bg-red-500", textColor: "text-red-400" };
    }
    if (score <= 3) {
      return { strength: 40, label: "Weak", color: "bg-orange-500", textColor: "text-orange-400" };
    }
    if (score <= 4) {
      return { strength: 60, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-400" };
    }
    if (score <= 5) {
      return { strength: 80, label: "Good", color: "bg-blue-500", textColor: "text-blue-400" };
    }
    return { strength: 100, label: "Strong", color: "bg-green-500", textColor: "text-green-400" };
  }, [password]);

  if (!password) return null;

  return (
    <div className={`mt-2 space-y-1.5 ${className}`}>
      {/* Strength Label */}
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Password strength</span>
          <span className={`font-medium ${strengthLevel.textColor}`}>
            {strengthLevel.label}
          </span>
        </div>
      )}

      {/* Strength Bar */}
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${strengthLevel.color} transition-all duration-300 ease-out`}
          style={{ width: `${strengthLevel.strength}%` }}
          role="progressbar"
          aria-valuenow={strengthLevel.strength}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Password strength: ${strengthLevel.label}`}
        />
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
        <PasswordRequirement met={password.length >= 6} text="6+ characters" />
        <PasswordRequirement met={/[A-Z]/.test(password)} text="Uppercase" />
        <PasswordRequirement met={/[a-z]/.test(password)} text="Lowercase" />
        <PasswordRequirement met={/[0-9]/.test(password)} text="Number" />
      </div>
    </div>
  );
}

/**
 * Password Requirement Indicator
 */
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1 ${met ? "text-green-400" : "text-gray-500"}`}>
      {met ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span>{text}</span>
    </div>
  );
}
