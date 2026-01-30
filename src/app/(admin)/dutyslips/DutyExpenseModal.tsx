"use client";

import { useEffect } from "react";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    DutyExpenseFormValues,
    dutyExpenseSchema,
    useCreateDutyExpenseMutation,
} from "@/features/dutyExpense";

type Props = {
    open: boolean;
    onClose: () => void;
    dutyId: number | null;
};

const DutyExpenseModal = ({
    open,
    onClose,
    dutyId,
}: Props) => {
    // ===============================
    // API
    // ===============================
    const [
        createDutyExpense,
        { isLoading },
    ] = useCreateDutyExpenseMutation();

    // ===============================
    // FORM
    // ===============================
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DutyExpenseFormValues>({
        resolver: zodResolver(dutyExpenseSchema),
        defaultValues: {
            expenseType: "",
            description: "",
            expenseAmount: "",
        },
    });

    // ===============================
    // RESET ON OPEN
    // ===============================
    useEffect(() => {

        if (open) {
            reset();
        }
    }, [open, reset]);

    if (!open) return null;


    // ===============================
    // SUBMIT
    // ===============================
    const onSubmit = async (
        values: DutyExpenseFormValues
    ) => {
        if (!dutyId) {
            enqueueSnackbar("Invalid duty", {
                variant: "error",
            });
            return;
        }

        try {
            await createDutyExpense({
                dutyId,
                expenseType: values.expenseType,
                description: values.description,
                expenseAmount: values.expenseAmount,
            }).unwrap();
            enqueueSnackbar("Expense added successfully", {
                variant: "success",
            });
            // small delay helps UX + refetch
            setTimeout(() => {
                onClose();
            }, 300);

            onClose();
        } catch (err: any) {
            enqueueSnackbar(
                err?.data?.message ||
                "Failed to add expense",
                { variant: "error" }
            );
        }
    };

    // ===============================
    // UI
    // ===============================
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded bg-white p-4 space-y-4">
                <h2 className="text-lg font-semibold">
                    Add Duty Expense
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    {/* EXPENSE TYPE */}
                    <div>
                        <input
                            type="text"
                            placeholder="Expense Type (Fuel, Toll, Food)"
                            className="w-full border rounded px-3 py-2"
                            {...register("expenseType")}
                        />
                        {errors.expenseType && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.expenseType.message}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <textarea
                            placeholder="Description (optional)"
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <input
                            type="text"
                            placeholder="Expense Amount"
                            className="w-full border rounded px-3 py-2"
                            {...register("expenseAmount")}
                        />
                        {errors.expenseAmount && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.expenseAmount.message}
                            </p>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Add Expense"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DutyExpenseModal;
