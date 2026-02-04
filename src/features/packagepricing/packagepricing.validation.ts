import { z } from "zod";

/* ===============================
   DAY TYPE (ULTRA SAFE)
================================ */

export const dayTypeSchema = z
  .union([z.literal("Weekday"), z.literal("Weekend")])
  .refine(
    (val) => val === "Weekday" || val === "Weekend",
    "Day type must be Weekday or Weekend"
  );

/* ===============================
   CREATE PACKAGE PRICING
================================ */

export const createPackagePricingSchema = z.object({
  packageId: z
    .number()
    .refine((val) => val > 0, "Package is required"),

  dayType: dayTypeSchema,

  pricePerPerson: z
    .number()
    .refine((val) => val > 0, "Price per person must be greater than 0"),

  minPersons: z
    .number()
    .refine((val) => val >= 1, "Minimum persons must be at least 1"),
});

/* ===============================
   UPDATE PACKAGE PRICING
================================ */

export const updatePackagePricingSchema = z.object({
  pricingId: z
    .number()
    .refine((val) => val > 0, "Pricing ID is required"),

  pricePerPerson: z
    .number()
    .refine((val) => val > 0, "Price per person must be greater than 0"),

  minPersons: z
    .number()
    .refine((val) => val >= 1, "Minimum persons must be at least 1"),
});

/* ===============================
   TYPES
================================ */

export type CreatePackagePricingFormValues = z.infer<
  typeof createPackagePricingSchema
>;

export type UpdatePackagePricingFormValues = z.infer<
  typeof updatePackagePricingSchema
>;
