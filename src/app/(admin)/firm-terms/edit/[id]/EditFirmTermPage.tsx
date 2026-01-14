"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CustomInput from "@/components/atoms/CustomInput";
import CustomSelect from "@/components/atoms/CustomSelect";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";

import {
    useGetFirmTermByIdQuery,
    useUpdateFirmTermMutation,
} from "@/features/firmTerm/firmTermApi";
import { useGetFirmsQuery } from "@/features/firm/firmApi";

export default function EditFirmTermPage() {
    const router = useRouter();
    const params = useParams();

    const termId = Number(params.id);

    const { data: term, isLoading, isError } = useGetFirmTermByIdQuery(termId, {
        skip: !termId || Number.isNaN(termId),
    });

    const { data: firms } = useGetFirmsQuery();

    const [updateFirmTerm, { isLoading: isUpdating }] =
        useUpdateFirmTermMutation();

    const [form, setForm] = useState({
        firmId: 0,
        description: "",
        isActive: true,
    });

    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (term) {
            setForm({
                firmId: term.firmId,
                description: term.description ?? "",
                isActive: term.isActive ?? true,
            });
        }
    }, [term]);

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
            await updateFirmTerm({ id: termId, body: form }).unwrap();

            enqueueSnackbar("Firm term updated successfully", {
                variant: "success",
            });

            router.push(`/firm-terms/${termId}`);
        } catch (err: any) {
            setFormError(
                err?.data?.message ||
                    "Something went wrong while updating the firm term."
            );
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError || !term) return <div>Firm term not found.</div>;

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Edit Firm Term
                </h1>
                <p className="text-sm text-gray-500">
                    Update firm term information
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

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomSelect
                                label="Firm"
                                name="firmId"
                                value={form.firmId || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        firmId: Number(e.target.value) || 0,
                                    }))
                                }
                                options={
                                    firms?.map((f) => ({
                                        id: f.firmId,
                                        name: `${f.firmName} (${f.firmCode})`,
                                    })) || []
                                }
                            />
                        </div>

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
                            isLoading={isUpdating}
                        >
                            Save Firm Term
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
