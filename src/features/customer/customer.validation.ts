import { z } from "zod";

/**
 * CREATE / UPDATE CUSTOMER SCHEMA
 */
export const CustomerSchema = z.object({
  customerId: z.number().optional(),

  firmId: z.number().optional(), // derived from token (not required in form)

  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name must be under 100 characters"),

  address: z
    .string()
    .max(250, "Address must be under 250 characters")
    .optional(),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format"
    )
    .optional(),

  logoImagePath: z.string().optional(),

  isActive: z.boolean(),
});

/**
 * CUSTOMER LIST SCHEMA
 */
export const CustomerListSchema = z.array(CustomerSchema);

/**
 * CREATE CUSTOMER FORM SCHEMA (with image)
 */
export const CreateCustomerSchema = z.object({
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100),

  address: z.string().optional(),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format"
    )
    .optional(),

  logoImage: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      "Logo image must be under 2MB"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Only JPG, JPEG, PNG images are allowed"
    ),
});
