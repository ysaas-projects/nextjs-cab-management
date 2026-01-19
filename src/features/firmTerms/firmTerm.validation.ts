import { z } from "zod";

export const firmTermSchema = z.object({
    firmId: z.number().min(1, "Firm is required"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean(),
});

export type FirmTermFormValues = z.infer<typeof firmTermSchema>;
