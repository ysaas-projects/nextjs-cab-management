"use client";

import Button from "@/components/atoms/Button";
import { useGetCabPricingMatrixByCabIdQuery } from "@/features/cabprice/cabpriceApi";
import { useEffect, useState } from "react";

type Props = {
    cabId: number;
    totalAmount?: number;
    totalKms?: number;
    totalTimeInMin?: number;

    onChange?: (selected: { rule: string; amount: number }[]) => void;
    onSave?: (selected: { rule: string; amount: number }[]) => void;
};

export default function CabPricingSection({
    cabId,
    onSave,
    onChange,
    totalAmount,
    totalKms = 0,
    totalTimeInMin = 0,
}: Props) {

    const { data, isLoading, isError } =
        useGetCabPricingMatrixByCabIdQuery(cabId);

    const [selectedRules, setSelectedRules] = useState<number[]>([]);

    const totalHours = totalTimeInMin / 60;

    /* ================= AUTO PACKAGE SELECTION ================= */

    useEffect(() => {

        if (!data) return;

        /* IMPORTANT FIX → rules already selected असतील तर override करू नको */
        if (selectedRules.length > 0) return;

        let packageName = "";

        if (totalKms <= 40) {
            packageName = "40km";
        } 
        else if (totalKms <= 80) {
            packageName = "80km";
        } 
        else {
            packageName = "outstation";
        }

        const rule = data.find(x =>
            x.pricingRuleName.toLowerCase().includes(packageName)
        );

        if (rule) {
            setSelectedRules([rule.pricingRuleId]);
        }

    }, [data, totalKms]);

    /* ================= LIVE UPDATE ================= */

    useEffect(() => {

        if (!data || !onChange) return;

        const selected = data
            .filter(x => selectedRules.includes(x.pricingRuleId))
            .map(x => ({
                rule: x.pricingRuleName,
                amount: x.price ?? 0
            }));

        onChange(selected);

    }, [selectedRules, data, onChange]);

    /* ================= TOGGLE ================= */

    const toggleRule = (ruleId: number) => {

        setSelectedRules(prev =>
            prev.includes(ruleId)
                ? prev.filter(id => id !== ruleId)
                : [...prev, ruleId]
        );

    };

    /* ================= SAVE ================= */

    const handleSave = () => {

        if (!data || !onSave) return;

        const selected = data
            .filter(x => selectedRules.includes(x.pricingRuleId))
            .map(x => ({
                rule: x.pricingRuleName,
                amount: x.price ?? 0
            }));

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

    /* ================= BASE PACKAGE ================= */

    let baseKm = 40;
    let baseHours = 4;

    const has80 = selectedRules.some(id =>
        data.find(x => x.pricingRuleId === id)
            ?.pricingRuleName
            .toLowerCase()
            .includes("80km")
    );

    const hasOutstation = selectedRules.some(id =>
        data.find(x => x.pricingRuleId === id)
            ?.pricingRuleName
            .toLowerCase()
            .includes("outstation")
    );

    if (hasOutstation) {
        baseKm = 300;
        baseHours = 24;
    }
    else if (has80) {
        baseKm = 80;
        baseHours = 8;
    }

    const extraKm = Math.max(totalKms - baseKm, 0);
    const extraHrs = Math.max(totalHours - baseHours, 0);

    return (
        <div className="bg-white rounded-xl border shadow-sm">

            {/* HEADER */}

            <div className="px-6 py-4 border-b flex justify-between items-center">

                <h3 className="font-semibold text-gray-800">
                    Cab Pricing
                </h3>

                {onSave && (
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                )}

            </div>

            {/* BODY */}

            <div className="p-6 bg-gray-100">

                <table className="w-full text-sm">

                    <tbody>

                        {data.map((item) => {

                            const checked =
                                selectedRules.includes(item.pricingRuleId);

                            const name =
                                item.pricingRuleName.toLowerCase();

                            const price = item.price ?? 0;

                            let displayValue: any = `₹ ${price}`;

                            if (!checked) displayValue = "₹ 0";

                            if (checked && name.includes("extra kms")) {

                                const amount = extraKm * price;

                                displayValue =
                                    `(${extraKm} × ${price}) = ₹ ${amount}`;
                            }

                            if (checked && name.includes("extra hrs")) {

                                const amount = extraHrs * price;

                                displayValue =
                                    `(${extraHrs.toFixed(1)} × ${price}) = ₹ ${amount}`;
                            }

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
                                                disabled={
                                                    (totalKms <= 40 && name.includes("80km")) ||
                                                    (totalKms <= 80 && name.includes("outstation"))
                                                }
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
                                                    ₹ {price}
                                                </div>

                                            </div>

                                        </label>

                                    </td>

                                    <td className="py-3 text-right font-semibold">
                                        {displayValue}
                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

                {totalAmount !== undefined && (

                    <div className="border-t mt-4 pt-3 flex justify-between font-semibold text-gray-800">

                        <span>Total</span>
                        <span>₹ {totalAmount.toFixed(2)}</span>

                    </div>

                )}

            </div>

        </div>
    );
}