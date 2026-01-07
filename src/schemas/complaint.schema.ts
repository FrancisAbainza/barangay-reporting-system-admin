import { z } from "zod";

export const resolutionSchema = z.object({
  description: z.string().min(1, "Resolution description is required"),
  budget: z.string().optional(),
  images: z.array(z.any()).max(1, "Maximum 1 image allowed").optional(),
});

export type ResolutionFormValues = z.infer<typeof resolutionSchema>;

export const scheduledSchema = z.object({
  scheduledDate: z.string().min(1, "Scheduled date is required"),
});

export type ScheduledFormValues = z.infer<typeof scheduledSchema>;
