"use client";

import Button from "@/components/atoms/Button";
import {
    useGetDutyExpensesQuery,
    DutyExpense,
} from "@/features/dutyExpense";

type Props = {
    dutyId: number;
    onAddExpense: () => void;
};

const DutyExpenseList = ({
    dutyId,
    onAddExpense,
}: Props) => {
    const {
        data = [],
        isLoading,
    } = useGetDutyExpensesQuery();

    // ===============================
    // FILTER BY DUTY
    // ===============================
    const expenses = data.filter(
        (e) => e.dutyId === dutyId
    );

    // ===============================
    // TOTAL
    // ===============================
    const totalAmount = expenses.reduce(
        (sum, e) =>
            sum + (Number(e.expenseAmount) || 0),
        0
    );

    if (isLoading) {
        return (
            <div className="text-sm text-gray-500">
                Loading expenses...
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">
                    Duty Expenses
                </h3>

                <Button
                    size="xs"
                    variant="primary"
                    onClick={onAddExpense}
                >
                    + Add Expense
                </Button>
            </div>

            {/* TABLE */}
            {expenses.length === 0 ? (
                <p className="text-xs text-gray-500">
                    No expenses added yet.
                </p>
            ) : (
                <table className="w-full text-xs border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 text-left">
                                Type
                            </th>
                            <th className="border px-2 py-1 text-left">
                                Description
                            </th>
                            <th className="border px-2 py-1 text-right">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((e) => (
                            <tr key={e.dutyExpenseId}>
                                <td className="border px-2 py-1">
                                    {e.expenseType}
                                </td>
                                <td className="border px-2 py-1">
                                    {e.description || "—"}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    ₹ {e.expenseAmount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* TOTAL */}
            <div className="flex justify-end font-medium text-sm">
                Total Expense: ₹ {totalAmount}
            </div>
        </div>
    );
};

export default DutyExpenseList;
