import { z } from "zod";

export const cabSpeedOverrideSchema = z.object({
    cabId: z.number().min(1, "Cab is required"),

    avgSpeedOverride: z
        .number()
        .min(5, "Speed too low")
        .max(120, "Speed too high"),

    reason: z.string().optional(),
});

export type CabSpeedOverrideFormValues =
    z.infer<typeof cabSpeedOverrideSchema>;