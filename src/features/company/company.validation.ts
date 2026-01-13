// src/features/company/company.validation.ts

import { z } from "zod";

export const companySchema = z.object({
    companyCode: z
        .string()
        .min(2, "Company code is required")
        .max(20, "Company code too long"),

    companyName: z
        .string()
        .min(2, "Company name is required"),

    businessType: z
        .string()
        .optional(),

    gstNumber: z
        .string()
        .optional(),

    panNumber: z
        .string()
        .optional(),

    address: z
        .string()
        .optional(),

    stateId: z
        .number()
        .min(1, "State is required"),

    cityId: z
        .number()
        .min(1, "City is required"),

    pincode: z
        .string()
        .optional(),

    country: z
        .string()
        .optional(),

    contactEmail: z
        .string()
        .email("Invalid email")
        .optional(),

    contactPhone: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .optional(),

    isActive: z.boolean().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
