"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CustomInput from "@/components/atoms/CustomInput";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";

import {
    useGetFirmByIdQuery,
    useUpdateFirmMutation,
} from "@/features/firm/firmApi";

export default function EditFirmPage() {
    const router = useRouter();
    const params = useParams();

    const firmId = Number(params.id);

    const { data: firm, isLoading, isError } = useGetFirmByIdQuery(firmId, {
        skip: !firmId || Number.isNaN(firmId),
    });

    const [updateFirm, { isLoading: isUpdating }] = useUpdateFirmMutation();

    const [form, setForm] = useState({
        firmName: "",
        firmCode: "",
        isActive: true,
    });

    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
  if (firm) {
    setForm({
      firmName: firm.firmName,
      firmCode: firm.firmCode,
      isActive: firm.isActive,
    });
  }
}, [firm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setFormError(null);

        try {
            await updateFirm({ id: firmId, body: form }).unwrap();

            enqueueSnackbar("Firm updated successfully", {
                variant: "success",
            });

            router.push(`/firms/${firmId}`);
        } catch (err: any) {
            setFormError(
                err?.data?.message || "Something went wrong while updating the firm."
            );
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError || !firm) return <div>Firm not found.</div>;

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Firm</h1>
                <p className="text-sm text-gray-500">Update firm information</p>
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
                            <label className="text-sm font-medium text-gray-700">IsActive</label>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button variant="default" onClick={() => router.back()}>
                            Cancel
                        </Button>

                        <Button variant="primary" onClick={handleSave} isLoading={isUpdating}>
                            Save Firm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
