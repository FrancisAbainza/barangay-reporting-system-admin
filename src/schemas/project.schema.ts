import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum([
    "infrastructure",
    "health",
    "education",
    "environment",
    "livelihood",
    "disaster_preparedness",
    "social_services",
    "sports_culture",
    "others",
  ]),
  status: z.enum([
    "planned",
    "approved",
    "ongoing",
    "on_hold",
    "completed",
    "cancelled",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  expectedCompletionDate: z.string().optional(),
  actualCompletionDate: z.string().optional(),
  budget: z.string().optional(),
  contractor: z.string().optional(),
  sourceOfFunds: z.string().optional(),
  progressPercentage: z
    .string()
    .min(1, "Progress percentage is required")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "Progress percentage must be between 0 and 100" }
    ),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      address: z.string().min(1, "Address is required"),
    })
    .optional()
    .nullable(),
  images: z.array(z.any()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const updateStatusSchema = z.object({
  status: z.enum([
    "planned",
    "approved",
    "ongoing",
    "on_hold",
    "completed",
    "cancelled",
  ]),
  progressPercentage: z.number().min(0).max(100),
  progressUpdateDescription: z.string().optional(),
  progressUpdateImage: z
    .object({
      uri: z.string(),
    })
    .optional(),
});

export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;
