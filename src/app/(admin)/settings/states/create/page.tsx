"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import { useCreateStateMutation } from "@/features/states/stateApi";
import { stateSchema } from "@/features/states/state.validation";

export default function CreateStatePage() {
    const router = useRouter();
    const [createState, { isLoading }] = useCreateStateMutation();

    const [form, setForm] = useState({
        stateName: "",
        country: "India",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        const result = stateSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            setFormError("Please fix the errors below.");
            return;
        }

        try {
            await createState(result.data).unwrap();

            enqueueSnackbar("State created successfully", {
                variant: "success",
            });

            // ✅ Redirect to State List
            router.push("/settings/states");
        } catch {
            setFormError("Something went wrong while saving the state.");
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Add New State
                </h1>
                <p className="text-sm text-gray-500">
                    Provide state information
                </p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">
                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

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
                            isLoading={isLoading}
                        >
                            Save State
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
