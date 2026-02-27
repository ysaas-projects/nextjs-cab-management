"use client";

import Button from "@/components/atoms/Button";
import {
    useGetCabPricingMatrixByCabIdQuery,
} from "@/features/cabprice/cabpriceApi";
import { CabPricingMatrix } from "@/features/cabprice/cabprice.types";
import { useEffect, useState } from "react";

type Props = {
    cabId: number;
    onSave?: (selected: CabPricingMatrix[]) => void;
};

const CabPricingSection = ({ cabId, onSave }: Props) => {
    const { data, isLoading, isError } =
        useGetCabPricingMatrixByCabIdQuery(cabId);

    const [selectedRules, setSelectedRules] = useState<number[]>([]);

    // Initialize checked rules where price exists
    useEffect(() => {
        if (data) {
            const checked = data
                .filter((x) => x.price !== null)
                .map((x) => x.pricingRuleId);
            setSelectedRules(checked);
        }
    }, [data]);

    const toggleRule = (ruleId: number) => {
        setSelectedRules((prev) =>
            prev.includes(ruleId)
                ? prev.filter((id) => id !== ruleId)
                : [...prev, ruleId]
        );
    };

    const handleSave = () => {
        if (!data || !onSave) return;

        const selected = data.filter((x) =>
            selectedRules.includes(x.pricingRuleId)
        );

        onSave(selected);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border p-6">
                Loading cab pricing...
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-white rounded-xl border p-6 text-red-600">
                Failed to load cab pricing
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border shadow-sm bg-gray-300">
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                    Cab Pricing
                </h3>

                {onSave && (
                    <Button size="sm" variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                )}
            </div>

            {/* BODY */}
            <div className="p-6 bg-gray-100">
                {data.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">
                        No pricing rules configured.
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <tbody>
                            {data.map((item) => {
                                const checked = selectedRules.includes(
                                    item.pricingRuleId
                                );

                                return (
                                    <tr
                                        key={item.pricingRuleId}
                                        className="border-b last:border-none"
                                    >
                                        <td className="py-3">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        toggleRule(item.pricingRuleId)
                                                    }
                                                    className="mt-1"
                                                />

                                                <div>
                                                    <div className="text-gray-800 font-medium">
                                                        {item.pricingRuleName}
                                                    </div>

                                                    <div className="text-xs text-gray-400">
                                                        {item.price !== null
                                                            ? `₹ ${item.price}`
                                                            : "Price not set"}
                                                    </div>
                                                </div>
                                            </label>
                                        </td>

                                        <td className="py-3 text-right font-semibold">
                                            {item.price !== null ? `₹ ${item.price}` : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CabPricingSection;