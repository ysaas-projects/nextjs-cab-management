import { z } from "zod";

// ===============================
// CREATE CAB PRICE
// ===============================
export const createCabPriceSchema = z.object({
  firmId: z.number().min(1, "Firm is required"),

  cabId: z.number().min(1, "Cab is required"),

  priceRuleId: z.number().min(1, "Price rule is required"),

  price: z
    .number()
    .min(0, "Price must be greater than or equal to 0"),

  isActive: z.boolean().optional(),
});

// ===============================
// UPDATE CAB PRICE
// ===============================
export const updateCabPriceSchema = z.object({
  cabPriceId: z.number().min(1),

  firmId: z.number().min(1, "Firm is required"),

  cabId: z.number().min(1, "Cab is required"),

  priceRuleId: z.number().min(1, "Price rule is required"),

  price: z
    .number()
    .min(0, "Price must be greater than or equal to 0"),

  isActive: z.boolean(),
});
