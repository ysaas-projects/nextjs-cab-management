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


// START JOURNEY
export const startJourneySchema = z.object({
  startKms: z.number().min(0).optional(),
  startDateTime: z.string().optional(),
});

// END JOURNEY
export const endJourneySchema = z.object({
  closeKms: z.number().min(0).optional(),
  totalKms: z.number().min(0).optional(),
});

// INSTRUCTION
export const instructionSchema = z.object({
  nextDayInstruction: z
    .string()
    .min(5, "Instruction must be at least 5 characters")
    .max(500),
});

// BILLING
export const billingSchema = z.object({
  paymentMode: z
    .string()
    .min(2, "Payment mode is required")
    .max(50),
});


export type DutySlipFormValues =
  z.infer<typeof dutySlipSchema>;
