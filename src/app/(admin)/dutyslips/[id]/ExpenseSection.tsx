"use client";

import Button from "@/components/atoms/Button";
import { DutyExpense } from "@/features/dutyExpense";

type Props = {
    expenses: DutyExpense[];
    onAddExpense: () => void;
};

const ExpenseSection = ({
    expenses,
    onAddExpense,
}: Props) => {
    const totalAmount = expenses.reduce(
        (sum, e) => sum + (Number(e.expenseAmount) || 0),
        0
    );

    return (
        <div className="bg-white rounded-xl border shadow-sm bg-gray-300">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                    Duty Expenses
                </h3>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={onAddExpense}
                >
                    + Add Expense
                </Button>
            </div>

            <div className="p-6 bg-gray-100">
                {expenses.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">
                        No expenses added yet.
                    </p>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <tbody>
                                {expenses.map((e) => (
                                    <tr
                                        key={e.dutyExpenseId}
                                        className="border-b last:border-none"
                                    >
                                        <td className="py-2 text-gray-700">
                                            {e.expenseType}
                                            {e.description && (
                                                <div className="text-xs text-gray-400">
                                                    {e.description}
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-2 text-right font-semibold">
                                            ₹ {e.expenseAmount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4 text-lg font-bold text-gray-900">
                            Total: ₹ {totalAmount}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExpenseSection;
