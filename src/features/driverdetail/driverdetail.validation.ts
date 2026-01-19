// src/features/driverdetail/driverdetail.validation.ts

import { z } from "zod";

export const driverDetailSchema = z.object({
  userId: z
    .number()
    .min(1, "User is required"),

  driverName: z
    .string()
    .min(2, "Driver name is required"),

  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(13, "Mobile number must be at most 13 digits"),

  isActive: z.boolean().optional(),
});

export type DriverDetailFormValues = z.infer<typeof driverDetailSchema>;
