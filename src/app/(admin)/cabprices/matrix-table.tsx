"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";

import {
    useCreateCabPriceMutation,
    useUpdateCabPriceMutation,
} from "@/features/cabprice";

import { CabPricingMatrix } from "@/features/cabprice/cabprice.types";

interface Props {
    data: CabPricingMatrix[];
}

const CabPriceMatrixTable = ({ data }: Props) => {
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");

    const [createCabPrice] = useCreateCabPriceMutation();
    const [updateCabPrice] = useUpdateCabPriceMutation();

    const grouped = data.reduce((acc, item) => {
        acc[item.cabId] ??= {
            cabType: item.cabType,
            rows: [],
        };
        acc[item.cabId].rows.push(item);
        return acc;
    }, {} as Record<number, { cabType: string; rows: CabPricingMatrix[] }>);

    const startEdit = (row: CabPricingMatrix) => {
        setEditingKey(`${row.cabId}-${row.pricingRuleId}`);
        setAmount(row.price?.toString() ?? "");
    };

    const cancelEdit = () => {
        setEditingKey(null);
        setAmount("");
    };

    const save = async (row: CabPricingMatrix) => {
        if (!amount) {
            enqueueSnackbar("Amount required", { variant: "error" });
            return;
        }

        try {
            if (row.cabPriceId) {
                // 🔁 UPDATE
                await updateCabPrice({
                    cabPriceId: row.cabPriceId,
                    payload: {
                        firmId:Number(0),
                        price: Number(amount),
                    },
                }).unwrap();

                enqueueSnackbar("Price updated", { variant: "success" });
            } else {
                // ➕ CREATE
                await createCabPrice({
                    cabId: row.cabId,
                    pricingRuleId: row.pricingRuleId,
                    price: Number(amount),
                    isActive: true,
                }).unwrap();

                enqueueSnackbar("Price added", { variant: "success" });
            }

            cancelEdit();
        } catch (err: any) {
            enqueueSnackbar(
                err?.data?.message || "Failed to save price",
                { variant: "error" }
            );
        }
    };

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([cabId, cab]) => (
                <div key={cabId} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-semibold">
                        🚕 {cab.cabType}
                    </div>

                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">Pricing Rule</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cab.rows.map((row) => {
                                const key = `${row.cabId}-${row.pricingRuleId}`;
                                const isEditing = editingKey === key;

                                return (
                                    <tr key={key} className="border-t">
                                        <td className="px-4 py-2">
                                            {row.pricingRuleName}
                                        </td>

                                        <td className="px-4 py-2">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="border rounded px-2 py-1 w-28"
                                                    value={amount}
                                                    onChange={(e) =>
                                                        setAmount(e.target.value)
                                                    }
                                                />
                                            ) : row.price !== null ? (
                                                `₹${row.price}`
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-2 text-center space-x-2">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        size="xs"
                                                        variant="primary"
                                                        onClick={() => save(row)}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        variant="default"
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                    <Button
                                                        size="xs"
                                                        variant="primary"
                                                        outline={!row.price}   // outline for "Add"
                                                        onClick={() => startEdit(row)}
                                                    >
                                                        {row.price ? "Edit" : "Add"}
                                                    </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default CabPriceMatrixTable;
