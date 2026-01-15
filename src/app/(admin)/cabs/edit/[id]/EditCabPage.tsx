"use client";

import CustomInput from "@/components/atoms/CustomInput";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetCabByIdQuery, useUpdateCabMutation } from "@/features/cab";
import { updateCabSchema } from "@/features/cab";
import { enqueueSnackbar } from "notistack";
import Button from "@/components/atoms/Button";

export default function EditCabPage() {
    const router = useRouter();
    const params = useParams();
    const [updateCab] = useUpdateCabMutation();

    const cabId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || "0", 10);

    const { data: cab, isLoading, isError } = useGetCabByIdQuery(cabId, { skip: !cabId });

    const [form, setForm] = useState({ firmId: "", cabType: "", isActive: true });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (cab && !isLoading) {
            setForm({ firmId: (cab as any).firmId?.toString() ?? "", cabType: (cab as any).cabType ?? "", isActive: (cab as any).isActive ?? true });
        }
    }, [cab, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const parsed = updateCabSchema.safeParse({
            cabId,
            firmId: parseInt(form.firmId || "0"),
            cabType: form.cabType,
            isActive: form.isActive,
        });

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            setFormError("Please fix the errors below and try again.");
            return;
        }

        try {
            const payload = { ...parsed.data };
            const response = await updateCab(payload).unwrap();
            enqueueSnackbar("Cab updated successfully", { variant: "success" });
            router.push(`/cabs/${cabId}`);
        } catch (err: any) {
            console.error(err);
            setFormError(err?.data?.message || "Failed to update cab");
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading cab.</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Cab</h1>
                <p className="text-sm text-gray-500">Update cab information</p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">
                    {formError && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{formError}</div>
                    )}

                    <section>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Firm ID" name="firmId" type="number" value={form.firmId} onChange={handleChange} error={errors.firmId} />
                            <CustomInput label="Cab Type" name="cabType" value={form.cabType} onChange={handleChange} error={errors.cabType} />
                            <div className="flex items-center md:col-span-2">
                                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="mr-2" />
                                <label className="text-sm font-medium text-gray-700">Is Active</label>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button variant="default" onClick={() => history.back()}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave}>Save Cab</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
