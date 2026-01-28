import { z } from "zod";

/**
 * Habit Schemas
 * 
 * Zod schemas for habit-related form validation.
 */

/**
 * Habit Frequency Enum
 */
export const habitFrequencyEnum = z.enum(["DAILY", "WEEKLY", "MONTHLY"]);

/**
 * Create Habit Schema
 */
export const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .min(2, "Habit name must be at least 2 characters")
    .max(100, "Habit name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  frequency: habitFrequencyEnum.default("DAILY"),
  targetCount: z
    .number()
    .int("Target count must be a whole number")
    .min(1, "Target count must be at least 1")
    .max(100, "Target count must be less than 100")
    .default(1),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color")
    .optional()
    .default("#00e5ff"),
  icon: z
    .string()
    .max(10, "Icon must be less than 10 characters")
    .optional()
    .default("🎯"),
});

export type CreateHabitFormData = z.infer<typeof createHabitSchema>;

/**
 * Update Habit Schema (all fields optional except name)
 */
export const updateHabitSchema = z.object({
  name: z
    .string()
    .min(2, "Habit name must be at least 2 characters")
    .max(100, "Habit name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  frequency: habitFrequencyEnum.optional(),
  targetCount: z
    .number()
    .int("Target count must be a whole number")
    .min(1, "Target count must be at least 1")
    .max(100, "Target count must be less than 100")
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color")
    .optional(),
  icon: z
    .string()
    .max(10, "Icon must be less than 10 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateHabitFormData = z.infer<typeof updateHabitSchema>;

/**
 * Habit Log Schema
 */
export const habitLogSchema = z.object({
  habitId: z.number().int().positive("Invalid habit ID"),
  date: z.string().datetime().or(z.date()),
  completed: z.boolean().default(false),
  count: z
    .number()
    .int()
    .min(0, "Count cannot be negative")
    .optional()
    .default(0),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

export type HabitLogFormData = z.infer<typeof habitLogSchema>;
