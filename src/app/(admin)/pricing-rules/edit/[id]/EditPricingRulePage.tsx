"use client";

import CustomInput from "@/components/atoms/CustomInput";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUpdatePricingRuleMutation, useGetPricingRuleByIdQuery } from "@/features/pricingRule/pricingRuleApi";
import { pricingRuleSchema } from "@/features/pricingRule";
import { enqueueSnackbar } from "notistack";
import Button from "@/components/atoms/Button";

export default function EditPricingRulePage() {
    const router = useRouter();
    const params = useParams();
    const [updatePricingRule] = useUpdatePricingRuleMutation();

    const [form, setForm] = useState({
        firmId: "",
        roleDetails: "",
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const pricingRuleId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || "0", 10);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        const result = pricingRuleSchema.safeParse({
            ...form,
            firmId: parseInt(form.firmId),
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            setFormError("Please fix the errors below and try again.");
            return;
        }

        try {
            const payload = {
                id: pricingRuleId,
                payload: result.data,
            };

            const response = await updatePricingRule(payload).unwrap();

            console.log("Pricing rule updated successfully!", response);
            enqueueSnackbar("Pricing rule updated successfully", {
                variant: "success",
            });

            router.push(`/pricing-rules/${pricingRuleId}`);
        } catch (err: any) {
            console.error("Failed to update pricing rule", err);
            setFormError(err.data?.message || "Something went wrong while updating the pricing rule.");
        }
    };

    const { data: pricingRule, isLoading, isError } = useGetPricingRuleByIdQuery(pricingRuleId, {
        skip: !pricingRuleId,
    });

    useEffect(() => {
        if (pricingRule && !isLoading) {
            console.log("Updating form with pricing rule data", pricingRule);
            setForm({
                firmId: pricingRule.firmId.toString(),
                roleDetails: pricingRule.roleDetails,
                isActive: pricingRule.isActive,
            });
        }
    }, [pricingRule, isLoading]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading pricing rule.</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Pricing Rule</h1>
                <p className="text-sm text-gray-500">
                    Update pricing rule details
                </p>
            </div>

            {/* Card Container */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">
                    {formError && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    {/* Basic Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Pricing Rule Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                label="Firm ID"
                                name="firmId"
                                type="number"
                                value={form.firmId}
                                onChange={handleChange}
                                error={errors.firmId}
                            />
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">Is Active</label>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role Details</label>
                            <textarea
                                name="roleDetails"
                                value={form.roleDetails}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter role details..."
                            />
                            {errors.roleDetails && (
                                <p className="mt-1 text-sm text-red-600">{errors.roleDetails}</p>
                            )}
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            variant="default"
                            onClick={() => history.back()}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSave}
                        >
                            Save Pricing Rule
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}