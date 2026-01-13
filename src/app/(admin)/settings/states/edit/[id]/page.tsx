"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import CustomInput from "@/components/atoms/CustomInput";
import Button from "@/components/atoms/Button";

import {
    useGetStateByIdQuery,
    useUpdateStateMutation,
} from "@/features/states/stateApi";
import { stateSchema } from "@/features/states/state.validation";

export default function EditStatePage() {
    const router = useRouter();
    const params = useParams();

    const stateId = Number(
        Array.isArray(params.id) ? params.id[0] : params.id
    );

    const [updateState, { isLoading: isSaving }] = useUpdateStateMutation();

    const { data: state, isLoading, isError } = useGetStateByIdQuery(stateId, {
        skip: !stateId,
    });

    const [form, setForm] = useState({
        stateName: "",
        country: "",
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (state) {
            setForm({
                stateName: state.stateName,
                country: state.country,
                isActive: state.isActive,
            });
        }
    }, [state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        const result = stateSchema.safeParse({
            stateName: form.stateName,
            country: form.country,
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
            await updateState({
                stateId,
                ...result.data,
                isActive: form.isActive,
            }).unwrap();

            enqueueSnackbar("State updated successfully", {
                variant: "success",
            });

            // ✅ Redirect to State List page
            router.push("/settings/states");
        } catch (err: any) {
            setFormError(
                err?.data?.message ||
                    "Something went wrong while updating the state."
            );
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading state.</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Edit State
                </h1>
                <p className="text-sm text-gray-500">
                    Update state details
                </p>
            </div>

            {/* Card */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">
                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    {/* Basic Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                label="State Name"
                                name="stateName"
                                value={form.stateName}
                                onChange={handleChange}
                                error={errors.stateName}
                            />

                            <CustomInput
                                label="Country"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                error={errors.country}
                            />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            variant="default"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Save State
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
