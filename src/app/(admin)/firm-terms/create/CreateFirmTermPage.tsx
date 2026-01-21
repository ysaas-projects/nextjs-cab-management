"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import CustomSelect from "@/components/atoms/CustomSelect";
import { useCreateFirmTermMutation } from "@/features/firmTerm/firmTermApi";
import { useGetFirmsQuery } from "@/features/firm/firmApi";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateFirmTermPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialFirmId = Number(searchParams.get("firmId")) || 0;

    const [createFirmTerm, { isLoading }] = useCreateFirmTermMutation();
    const { data: firms } = useGetFirmsQuery();

    const [formError, setFormError] = useState<string | null>(null);

    const [form, setForm] = useState({
        description: "",
        isActive: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setFormError(null);

        try {
            const payload = {
                description: form.description,
                isActive: form.isActive,
            };

            const response = await createFirmTerm(payload).unwrap();

            enqueueSnackbar("Firm term created successfully", {
                variant: "success",
            });

            router.push(`/firm-terms/${response.firmTermId}`);
        } catch (err: any) {
            setFormError(
                err?.data?.message ||
                    "Something went wrong while saving the firm term."
            );
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Add New Firm Term
                </h1>
                <p className="text-sm text-gray-500">
                    Provide firm term information
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
                            Firm Term Information
                        </h3>

                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                rows={3}
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
                            Save Firm Term
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
