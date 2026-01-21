// src/features/pricingRule/pricingRule.validation.ts

import { z } from "zod";

export const pricingRuleSchema = z.object({
    ruleDetails: z.string().min(1, "Role details are required"),
    isActive: z.boolean(),
});

export type PricingRuleFormValues = z.infer<typeof pricingRuleSchema>;