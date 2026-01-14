"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateCabMutation } from "@/features/cab/cabApi";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateCabPage() {
    const router = useRouter();
    const [createCab, { isLoading }] = useCreateCabMutation();

    const [formError, setFormError] = useState<string | null>(null);

    const [form, setForm] = useState({
        cabType: "",
        isActive: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setFormError(null);

        try {
            // ✅ Send JSON body (matches [FromBody])
            const response = await createCab(form).unwrap();

            enqueueSnackbar("Cab created successfully", {
                variant: "success",
            });

            router.push(`/cabs/${response.cabId}`);
        } catch (err: any) {
            setFormError(
                err?.data?.message || "Something went wrong while saving the cab."
            );
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Add New Cab
                </h1>
                <p className="text-sm text-gray-500">
                    Provide cab information
                </p>
            </div>

            {/* Card */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-8 p-6">
                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    {/* Cab Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Cab Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                label="Cab Type"
                                name="cabType"
                                value={form.cabType}
                                onChange={handleChange}
                                // placeholder="SUV / Sedan / Hatchback"
                            />
                        </div>

                        {/* ✅ IsActive checkbox */}
                        <div className="mt-4 flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                IsActive
                            </label>
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
                            isLoading={isLoading}
                        >
                            Save Cab
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
