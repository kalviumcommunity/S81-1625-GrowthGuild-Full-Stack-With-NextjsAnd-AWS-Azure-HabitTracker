import { z } from "zod";

/**
 * Contact Form Schema
 * 
 * Validation for contact/feedback forms.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  category: z.enum(["general", "support", "feedback", "bug", "feature"]).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Profile Update Schema
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  timezone: z.string().optional(),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    reminders: z.boolean().default(true),
  }).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Settings Schema
 */
export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  weekStartsOn: z.enum(["sunday", "monday"]).default("sunday"),
  showStreak: z.boolean().default(true),
  showCompletionRate: z.boolean().default(true),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
