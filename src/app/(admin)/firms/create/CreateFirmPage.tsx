"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateFirmMutation } from "@/features/firm/firmApi";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateFirmPage() {
    const router = useRouter();
    const [createFirm, { isLoading }] = useCreateFirmMutation();

    const [formError, setFormError] = useState<string | null>(null);

    const [form, setForm] = useState({
        firmName: "",
        firmCode: "",
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
            const response = await createFirm(form).unwrap();

            enqueueSnackbar("Firm created successfully", {
                variant: "success",
            });

            router.push(`/firms/${response.firmId}`);
        } catch (err: any) {
            setFormError(
                err?.data?.message || "Something went wrong while saving the firm."
            );
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Add New Firm
                </h1>
                <p className="text-sm text-gray-500">
                    Provide firm information
                </p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-8 p-6">
                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Firm Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                label="Firm Name"
                                name="firmName"
                                value={form.firmName}
                                onChange={handleChange}
                            />

                            <CustomInput
                                label="Firm Code"
                                name="firmCode"
                                value={form.firmCode}
                                onChange={handleChange}
                            />
                        </div>

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
                            Save Firm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
