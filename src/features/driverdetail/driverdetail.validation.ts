// src/features/driverdetail/driverdetail.validation.ts

import { z } from "zod";

export const driverDetailSchema = z.object({
  driverName: z.string().min(2),
  mobileNumber: z.string().min(10).max(13),
  isActive: z.boolean().optional(),
});


export type DriverDetailFormValues = z.infer<typeof driverDetailSchema>;
