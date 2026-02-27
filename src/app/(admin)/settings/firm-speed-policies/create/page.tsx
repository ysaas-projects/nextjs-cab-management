"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import { firmSpeedPolicySchema } from "@/features/firmSpeedPolicy/firmSpeedPolicy.validation";
import { useCreateFirmSpeedPolicyMutation } from "@/features/firmSpeedPolicy/firmSpeedPolicy.api";

export default function CreateFirmSpeedPolicyPage() {
    const router = useRouter();
    const [createPolicy, { isLoading }] = useCreateFirmSpeedPolicyMutation();

    const [form, setForm] = useState({
        dayAvgSpeed: 30,
        nightAvgSpeed: 45,
        minChargeableSpeed: 20,
        graceMinutes: 30,
        effectiveFrom: new Date().toISOString().split("T")[0],
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors({});
        const result = firmSpeedPolicySchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((i) => {
                fieldErrors[i.path[0] as string] = i.message;
            });
            setErrors(fieldErrors);
            return;
        }

        await createPolicy(result.data).unwrap();
        enqueueSnackbar("Speed policy created successfully", { variant: "success" });
        router.push("/settings/firm-speed-policies");
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-semibold">Create Speed Policy</h1>

            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput label="Day Avg Speed (km/hr)" name="dayAvgSpeed" value={form.dayAvgSpeed} onChange={handleChange} error={errors.dayAvgSpeed} />
                    <CustomInput label="Night Avg Speed (km/hr)" name="nightAvgSpeed" value={form.nightAvgSpeed} onChange={handleChange} error={errors.nightAvgSpeed} />
                    <CustomInput label="Min Chargeable Speed" name="minChargeableSpeed" value={form.minChargeableSpeed} onChange={handleChange} error={errors.minChargeableSpeed} />
                    <CustomInput label="Grace Minutes" name="graceMinutes" value={form.graceMinutes} onChange={handleChange} error={errors.graceMinutes} />
                    <CustomInput label="Effective From" type="date" name="effectiveFrom" value={form.effectiveFrom} onChange={handleChange} error={errors.effectiveFrom} />
                </div>

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Button variant="default" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                        Save Policy
                    </Button>
                </div>
            </div>
        </div>
    );
}