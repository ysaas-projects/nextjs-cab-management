"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
    useGetFirmSpeedPoliciesQuery,
    useUpdateFirmSpeedPolicyMutation,
} from "@/features/firmSpeedPolicy/firmSpeedPolicy.api";

import { firmSpeedPolicySchema } from "@/features/firmSpeedPolicy/firmSpeedPolicy.validation";

export default function EditFirmSpeedPolicyPage() {
    const router = useRouter();
    const params = useParams();
    const policyId = Number(params.id);

    const { data } = useGetFirmSpeedPoliciesQuery();
    const policy = data?.find((p) => p.firmSpeedPolicyId === policyId);

    const [updatePolicy, { isLoading }] =
        useUpdateFirmSpeedPolicyMutation();

    const [form, setForm] = useState<any>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (policy) {
            setForm({
                dayAvgSpeed: policy.dayAvgSpeed,
                nightAvgSpeed: policy.nightAvgSpeed,
                minChargeableSpeed: policy.minChargeableSpeed,
                graceMinutes: policy.graceMinutes,
                effectiveFrom: policy.effectiveFrom.split("T")[0],
                isActive: policy.isActive,
            });
        }
    }, [policy]);

    if (!form) return <div>Loading...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const result = firmSpeedPolicySchema.safeParse(form);
        if (!result.success) return;

        await updatePolicy({
            id: policyId,
            payload: result.data,
        }).unwrap();

        enqueueSnackbar("Speed policy updated", { variant: "success" });
        router.push("/settings/firm-speed-policies");
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-semibold">Edit Speed Policy</h1>

            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput label="Day Avg Speed" name="dayAvgSpeed" value={form.dayAvgSpeed} onChange={handleChange} />
                    <CustomInput label="Night Avg Speed" name="nightAvgSpeed" value={form.nightAvgSpeed} onChange={handleChange} />
                    <CustomInput label="Min Chargeable Speed" name="minChargeableSpeed" value={form.minChargeableSpeed} onChange={handleChange} />
                    <CustomInput label="Grace Minutes" name="graceMinutes" value={form.graceMinutes} onChange={handleChange} />
                    <CustomInput label="Effective From" type="date" name="effectiveFrom" value={form.effectiveFrom} onChange={handleChange} />
                </div>

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Button variant="default" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}