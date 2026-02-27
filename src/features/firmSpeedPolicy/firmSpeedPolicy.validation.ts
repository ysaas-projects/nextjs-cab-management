import { z } from "zod";

export const firmSpeedPolicySchema = z.object({
    dayAvgSpeed: z.number().min(5).max(120),
    nightAvgSpeed: z.number().min(5).max(120),
    minChargeableSpeed: z.number().min(1),
    graceMinutes: z.number().min(0).max(120),
    effectiveFrom: z.string(),
    isActive: z.boolean(),
});

export type FirmSpeedPolicyFormValues = z.infer<typeof firmSpeedPolicySchema>;