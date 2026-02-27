"use client";
// src/app/(admin)/settings/time-segments/edit/[id]/page.tsx

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
    useGetTimeSegmentByIdQuery,
    useUpdateTimeSegmentMutation,
} from "@/features/timeSegment/timeSegment.api";

import { timeSegmentSchema } from "@/features/timeSegment/timeSegment.validation";

export default function EditTimeSegmentPage() {
    const router = useRouter();
    const params = useParams();

    const timeSegmentId = Number(
        Array.isArray(params.id) ? params.id[0] : params.id
    );

    const { data: segment, isLoading, isError } =
        useGetTimeSegmentByIdQuery(timeSegmentId, {
            skip: !timeSegmentId,
        });

    const [updateSegment, { isLoading: isSaving }] =
        useUpdateTimeSegmentMutation();

    const [form, setForm] = useState({
        segmentName: "",
        startTime: "",
        endTime: "",
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    // ===============================
    // LOAD DATA INTO FORM
    // ===============================
    useEffect(() => {
        if (segment) {
            setForm({
                segmentName: segment.segmentName,
                startTime: segment.startTime,
                endTime: segment.endTime,
                isActive: segment.isActive,
            });
        }
    }, [segment]);

    // ===============================
    // HANDLE CHANGE
    // ===============================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ===============================
    // SAVE CHANGES
    // ===============================
    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        const result = timeSegmentSchema.safeParse(form);

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
            await updateSegment({
                id: timeSegmentId,
                payload: result.data,
            }).unwrap();

            enqueueSnackbar("Time segment updated successfully", {
                variant: "success",
            });

            router.push("/settings/time-segments");
        } catch (err: any) {
            setFormError(
                err?.data?.message ||
                "Something went wrong while updating the time segment."
            );
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading time segment.</div>;

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Edit Time Segment
                </h1>
                <p className="text-sm text-gray-500">
                    Update day or night time configuration
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

                    {/* Form */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Time Segment Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                label="Segment Name"
                                name="segmentName"
                                value={form.segmentName}
                                onChange={handleChange}
                                error={errors.segmentName}
                            />

                            <CustomInput
                                label="Start Time"
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                error={errors.startTime}
                            />

                            <CustomInput
                                label="End Time"
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                error={errors.endTime}
                            />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button variant="default" onClick={() => router.back()}>
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}