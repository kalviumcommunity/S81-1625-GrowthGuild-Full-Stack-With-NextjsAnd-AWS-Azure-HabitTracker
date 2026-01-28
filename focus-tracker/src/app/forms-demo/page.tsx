"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput, FormTextarea, FormSelect, FormCheckbox, PasswordStrength } from "@/components/forms";
import { useNotification } from "@/hooks";

// Demo schema with various validation rules
const demoSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  age: z
    .number({ message: "Age must be a number" })
    .int("Age must be a whole number")
    .min(13, "Must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal("")),
  category: z.enum(["personal", "work", "education", "other"]),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  newsletter: z.boolean(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type DemoFormData = z.infer<typeof demoSchema>;

/**
 * Forms Demo Page
 * 
 * Demonstrates all form components and validation patterns with React Hook Form + Zod.
 */
export default function FormsDemoPage() {
  const { success, error, info } = useNotification();
  const [formData, setFormData] = useState<DemoFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      age: 0,
      website: "",
      category: "personal" as const,
      bio: "",
      newsletter: true,
      terms: false,
    },
  });

  const password = watch("password");
  const bio = watch("bio");

  const onSubmit = async (data: DemoFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData(data);
      success("Form Submitted!", "All validations passed successfully.");
      console.log("Form Data:", data);
    } catch (err) {
      error("Submission Failed", "Please try again.");
    }
  };

  const categoryOptions = [
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">React Hook Form + Zod Demo</h1>
        <p className="text-gray-400">
          Interactive demonstration of form validation and reusable components
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card card-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">React Hook Form</h3>
              <p className="text-xs text-gray-400">Minimal re-renders</p>
            </div>
          </div>
        </div>
        <div className="card card-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
              <span className="text-xl">🔒</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Zod Validation</h3>
              <p className="text-xs text-gray-400">Type-safe schemas</p>
            </div>
          </div>
        </div>
        <div className="card card-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span className="text-xl">♿</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Accessible</h3>
              <p className="text-xs text-gray-400">ARIA labels & roles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card card-dark p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Demo Form
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Username */}
            <FormInput
              label="Username"
              placeholder="john_doe"
              register={register("username")}
              error={errors.username?.message}
              helperText="Letters, numbers, and underscores only"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* Email */}
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              register={register("email")}
              error={errors.email?.message}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Password with Strength */}
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
              />
              <PasswordStrength password={password || ""} />
            </div>

            {/* Age & Website Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Age"
                type="number"
                placeholder="25"
                register={register("age")}
                error={errors.age?.message}
              />
              <FormInput
                label="Website"
                type="url"
                placeholder="https://example.com"
                register={register("website")}
                error={errors.website?.message}
                helperText="Optional"
              />
            </div>

            {/* Category Select */}
            <FormSelect
              label="Category"
              options={categoryOptions}
              register={register("category")}
              error={errors.category?.message}
              placeholder="Select a category"
            />

            {/* Bio Textarea */}
            <FormTextarea
              label="Bio"
              placeholder="Tell us about yourself..."
              register={register("bio")}
              error={errors.bio?.message}
              rows={4}
              showCharCount
              maxLength={500}
              currentLength={bio?.length || 0}
            />

            {/* Checkboxes */}
            <div className="space-y-3">
              <FormCheckbox
                label="Subscribe to newsletter for tips and updates"
                register={register("newsletter")}
              />
              <FormCheckbox
                label={
                  <>
                    I agree to the{" "}
                    <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
                  </>
                }
                register={register("terms")}
                error={errors.terms?.message}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Form"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setFormData(null);
                  info("Form Reset", "All fields cleared.");
                }}
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
              >
                Reset
              </button>
            </div>

            {/* Validation Status */}
            <div className="text-sm text-gray-500 flex items-center justify-between">
              <span>
                {Object.keys(touchedFields).length} of 9 fields touched
              </span>
              <span className={isValid ? "text-green-400" : "text-amber-400"}>
                {isValid ? "✓ Form valid" : "⚠ Fix errors to submit"}
              </span>
            </div>
          </form>
        </div>

        {/* Output & Code */}
        <div className="space-y-6">
          {/* Submitted Data */}
          <div className="card card-dark p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Form Output
            </h2>
            {formData ? (
              <pre className="bg-gray-900/50 p-4 rounded-xl text-xs text-gray-300 overflow-auto max-h-64">
                {JSON.stringify(formData, null, 2)}
              </pre>
            ) : (
              <div className="bg-gray-900/50 p-6 rounded-xl text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Submit the form to see output
              </div>
            )}
          </div>

          {/* Code Example */}
          <div className="card card-dark p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Usage Example
            </h2>
            <pre className="bg-gray-900/50 p-4 rounded-xl text-xs text-gray-300 overflow-auto">
{`// 1. Import components
import { FormInput } from "@/components/forms";
import { zodResolver } from "@hookform/resolvers";
import { z } from "zod";

// 2. Define schema
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
});

// 3. Setup form
const { register, handleSubmit, formState } = 
  useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

// 4. Use components
<FormInput
  label="Email"
  register={register("email")}
  error={errors.email?.message}
/>`}
            </pre>
          </div>

          {/* Features List */}
          <div className="card card-dark p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Schema-based validation with Zod
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Real-time validation feedback
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> TypeScript type inference
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Accessible form components
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Password strength indicator
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Character count for textareas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Minimal re-renders
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
