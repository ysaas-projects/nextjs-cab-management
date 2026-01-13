// src > features > mill > mill.validation.ts

import { z } from "zod";

export const millSchema = z.object({
    millName: z.string().min(2, "Mill name is required"),
    millCode: z.string().min(2, "Mill code is required").max(10, "Mill code too long"),
    address: z.string().min(5, "Address is required"),
    stateId: z.number().min(1, "State is required"),
    cityId: z.number().min(1, "City is required"),
    contactPerson: z.string().min(2, "Contact person required"),
    contactNumber: z
        .string()
        .min(10, "Contact number must be 10 digits"),
    email: z.string().email("Invalid email"),
    gstNumber: z.string().min(5, "GST is required"),
    pincode: z.string().min(6, "Invalid pincode"),
});

export type MillFormValues = z.infer<typeof millSchema>;
