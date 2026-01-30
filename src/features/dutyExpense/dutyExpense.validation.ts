import { z } from "zod";

export const dutyExpenseSchema = z.object({
    expenseType: z
        .string()
        .min(2, "Expense type must be at least 2 characters")
        .max(100, "Expense type must be under 100 characters"),

    description: z
        .string()
        .max(500, "Description must be under 500 characters")
        .optional(),

    expenseAmount: z
        .string()
        .min(1, "Expense amount is required"),
});

export type DutyExpenseFormValues =
    z.infer<typeof dutyExpenseSchema>;
