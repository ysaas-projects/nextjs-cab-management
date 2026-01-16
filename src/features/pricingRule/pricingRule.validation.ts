// src/features/pricingRule/pricingRule.validation.ts

import { z } from "zod";

export const pricingRuleSchema = z.object({
    firmId: z.number().min(1, "Firm is required"),
    ruleDetails: z.string().min(1, "Role details are required"),
    isActive: z.boolean(),
});

export type PricingRuleFormValues = z.infer<typeof pricingRuleSchema>;