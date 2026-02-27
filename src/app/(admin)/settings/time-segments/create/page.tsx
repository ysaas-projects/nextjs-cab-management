"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { timeSegmentSchema } from "@/features/timeSegment/timeSegment.validation";
import { useCreateTimeSegmentMutation } from "@/features/timeSegment/timeSegment.api";

export default function CreateTimeSegmentPage() {
    const router = useRouter();
    const [createSegment, { isLoading }] = useCreateTimeSegmentMutation();

    const [form, setForm] = useState({
        segmentName: "",
        startTime: "",
        endTime: "",
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors({});
        const result = timeSegmentSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((i) => {
                fieldErrors[i.path[0] as string] = i.message;
            });
            setErrors(fieldErrors);
            return;
        }

        await createSegment(result.data).unwrap();
        enqueueSnackbar("Time segment created", { variant: "success" });
        router.push("/settings/time-segments");
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-semibold">Add Time Segment</h1>

            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                <CustomInput
                    label="Segment Name"
                    name="segmentName"
                    value={form.segmentName}
                    onChange={handleChange}
                    error={errors.segmentName}
                    placeholder="Day / Night"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Button variant="default" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}