import { z } from "zod";

export const seasonSchema = z.object({
  seasonName: z
    .string()
    .min(2, "Season name must be at least 2 characters"),

  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),

  isActive: z.boolean(),
});

export type SeasonFormValues = z.infer<typeof seasonSchema>;
