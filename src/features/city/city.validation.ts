import { z } from "zod";

export const citySchema = z.object({
  cityName: z.string().min(2, "City name is required"),
  stateId: z.number().min(1, "State is required"),
  isActive: z.boolean(),
});

export type CityFormValues = z.infer<typeof citySchema>;
