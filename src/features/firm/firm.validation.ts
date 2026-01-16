// src/validations/firms.validation.ts
import { z } from "zod";

export const FirmSchema = z.object({
  firmId: z.number(),
  firmName: z.string().min(1),
  firmCode: z.string().optional(),

  address: z.string().optional(),
  contactNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  logoImagePath: z.string().optional(),
  gstNumber: z.string().optional(),

  isActive: z.boolean(),
});

export const FirmListSchema = z.array(FirmSchema);