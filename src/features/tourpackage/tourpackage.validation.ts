import { z } from "zod";

export const tourPackageSchema = z.object({
  packageName: z
    .string()
    .min(2, "Package name must be at least 2 characters")
    .max(100, "Package name must be under 100 characters"),

  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),

  basePrice: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return Number(value);
    },
    z
      .number()
      .positive("Base price must be greater than 0")
  ),
});

export type TourPackageFormValues =
  z.infer<typeof tourPackageSchema>;
