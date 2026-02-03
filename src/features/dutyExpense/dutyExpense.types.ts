// src/features/dutyexpense/dutyexpense.types.ts

// ===============================
// API RESPONSE WRAPPER
// ===============================
export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

// ===============================
// ENTITY
// ===============================
export type DutyExpense = {
    dutyExpenseId: number;
    firmId?: number | null;

    dutyId: number;
    expenseType: string;
    description?: string | null;
    expenseAmount: string;

    createdAt: string;
    updatedAt?: string | null;
    isDeleted: boolean;
};

// ===============================
// CREATE
// ===============================
export type CreateDutyExpenseRequest = {
    dutyId: number;
    expenseType: string;
    description?: string;
    expenseAmount: string;
};

// ===============================
// UPDATE
// ===============================
export type UpdateDutyExpenseRequest = {
    dutyId: number;
    expenseType: string;
    description?: string;
    expenseAmount: string;
};
