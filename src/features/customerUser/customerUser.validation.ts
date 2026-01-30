import { z } from "zod";

export const CustomerUserSchema = z.object({
  customerUserId: z.number().optional(),
  firmId: z.number().optional(),

  customerId: z
    .number()
    .int("Customer is required")
    .positive("Customer is required"),

  userName: z
    .string()
    .min(1, "User name is required")
    .max(100, "User name must be under 100 characters"),

  mobileNumber: z
    .string()
    .trim()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be under 15 digits")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

export const CreateCustomerUserSchema = CustomerUserSchema.pick({
  customerId: true,
  userName: true,
  mobileNumber: true,
  isActive: true,
});

export const UpdateCustomerUserSchema = CustomerUserSchema.pick({
  userName: true,
  mobileNumber: true,
  isActive: true,
});
