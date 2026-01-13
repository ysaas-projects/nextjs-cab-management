import { z } from "zod";

export const stateSchema = z.object({
    stateName: z
        .string()
        .min(2, "State name is required"),
    country: z
        .string()
        .min(2, "Country is required"),
});

export type StateFormValues = z.infer<typeof stateSchema>;
