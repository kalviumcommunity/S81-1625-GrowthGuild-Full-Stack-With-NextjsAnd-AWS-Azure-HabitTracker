"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/schemas/authSchemas";
import { FormInput, FormCheckbox, PasswordStrength } from "@/components/forms";

/**
 * Signup Page with React Hook Form + Zod Validation
 * 
 * Features:
 * - Schema-based validation using Zod
 * - Real-time validation feedback
 * - Password strength indicator
 * - Accessible form components
 * - Optimized re-renders with React Hook Form
 */
export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Watch password for strength indicator and confirmation match
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch = !!(password && confirmPassword && password === confirmPassword);

  // Form submission handler
  const onSubmit = async (data: SignupFormData) => {
    setServerError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setServerError(result.message || "Signup failed. Please try again.");
        return;
      }

      // Redirect to login with success message
      router.push("/login?registered=true");
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-gray-400">
            Start your habit tracking journey today
          </p>
        </div>

        {/* Signup Form */}
        <div className="card card-dark rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Server Error Message */}
            {serverError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* Name Field */}
            <FormInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              register={register("name")}
              error={errors.name?.message}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              autoComplete="name"
            />

            {/* Email Field */}
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              register={register("email")}
              error={errors.email?.message}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
              autoComplete="email"
            />

            {/* Password Field */}
            <div>
              <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
                register={register("password")}
                error={errors.password?.message}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                autoComplete="new-password"
              />
              {/* Password Strength Indicator */}
              <PasswordStrength password={password || ""} />
            </div>

            {/* Confirm Password Field */}
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              isSuccess={passwordsMatch}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              autoComplete="new-password"
            />

            {/* Terms & Conditions */}
            <FormCheckbox
              label={
                <>
                  I agree to the{" "}
                  <Link href="/terms" className="text-cyan-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-400 hover:underline">
                    Privacy Policy
                  </Link>
                </>
              }
              register={register("terms")}
              error={errors.terms?.message}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Form Status */}
            {Object.keys(dirtyFields).length > 0 && !isValid && (
              <p className="text-xs text-gray-500 text-center">
                Please fix the errors above to continue
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-500">or sign up with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-300">Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 transition-all">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium text-gray-300">GitHub</span>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        {/* Features highlight */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-500">Secure</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-500">Fast</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs text-gray-500">Effective</p>
          </div>
        </div>
      </div>
    </div>
  );
}
