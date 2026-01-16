// cab/cab.validation.ts
import { z } from "zod";

export const createCabSchema = z.object({
  firmId: z.number().min(1, "Firm is required"),
  cabType: z
    .string()
    .min(1, "Cab type is required")
    .max(50, "Maximum 50 characters"),
  isActive: z.boolean().optional(),
});

export const updateCabSchema = z.object({
  cabId: z.number().min(1),
  firmId: z.number().min(1, "Firm is required"),
  cabType: z
    .string()
    .min(1, "Cab type is required")
    .max(50, "Maximum 50 characters"),
  isActive: z.boolean(),
});
