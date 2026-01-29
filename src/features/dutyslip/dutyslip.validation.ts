// src/features/dutyslip/dutyslip.validation.ts
import { z } from "zod";

export const dutySlipSchema = z.object({
  customerId: z
    .number()
    .min(1, "Customer is required"),

  requestedCab: z
    .number()
    .optional(),

  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(255, "Destination must be under 255 characters"),
});

export type DutySlipFormValues =
  z.infer<typeof dutySlipSchema>;
