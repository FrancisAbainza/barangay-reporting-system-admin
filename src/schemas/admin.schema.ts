import { z } from "zod";

export const createAdminSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
    role: z.enum(["super_admin", "regular_admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;
