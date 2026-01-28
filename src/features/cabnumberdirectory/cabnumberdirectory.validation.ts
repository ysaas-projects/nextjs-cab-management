import { z } from "zod";

const CAB_NUMBER_REGEX = /^[A-Z0-9\- ]+$/;

/**
 * BASE SCHEMA (for validation only, not type export)
 */
export const CabNumberDirectorySchema = z.object({
  cabNumberDirectoryId: z.number(),
  firmId: z.number().optional(),
  firmName: z.string().optional(),
  cabId: z.number(),
  cabType: z.string().optional(),
  cabNumber: z
    .string()
    .min(3, "Cab number must be at least 3 characters")
    .max(20, "Cab number must be under 20 characters")
    .regex(
      CAB_NUMBER_REGEX,
      "Cab number can contain only capital letters, numbers, spaces and hyphen"
    ),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

/**
 * CREATE SCHEMA
 */
export const CreateCabNumberSchema = z.object({
  cabId: z.number().refine((val) => val > 0, {
    message: "Cab is required",
  }),

  cabNumber: z
    .string()
    .min(3, "Cab number must be at least 3 characters")
    .max(20, "Cab number must be under 20 characters")
    .regex(
      CAB_NUMBER_REGEX,
      "Cab number can contain only capital letters, numbers, spaces and hyphen"
    ),

  isActive: z.boolean().optional(),
});

/**
 * UPDATE SCHEMA
 */
export const UpdateCabNumberSchema = z.object({
  cabNumberDirectoryId: z.number(),

  cabId: z.number().refine((val) => val > 0, {
    message: "Cab is required",
  }),

  cabNumber: z
    .string()
    .min(3, "Cab number must be at least 3 characters")
    .max(20, "Cab number must be under 20 characters")
    .regex(
      CAB_NUMBER_REGEX,
      "Cab number can contain only capital letters, numbers, spaces and hyphen"
    ),

  isActive: z.boolean(),
});

/**
 * FORM VALUE TYPES (ONLY THESE TYPES ARE ALLOWED HERE)
 */
export type CreateCabNumberFormValues = z.infer<
  typeof CreateCabNumberSchema
>;

export type UpdateCabNumberFormValues = z.infer<
  typeof UpdateCabNumberSchema
>;
