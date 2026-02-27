"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
    useGetCabSpeedOverrideByCabIdQuery,
    useSaveCabSpeedOverrideMutation,
    useDeleteCabSpeedOverrideMutation,
} from "@/features/cabSpeedOverride/cabSpeedOverride.api";

import {
    cabSpeedOverrideSchema,
} from "@/features/cabSpeedOverride/cabSpeedOverride.validation";

export default function CabSpeedOverridePage() {
    const router = useRouter();
    const params = useParams();
    const cabId = Number(params.id);

    const { data, isLoading } =
        useGetCabSpeedOverrideByCabIdQuery(cabId);

    const [saveOverride, { isLoading: isSaving }] =
        useSaveCabSpeedOverrideMutation();

    const [deleteOverride, { isLoading: isDeleting }] =
        useDeleteCabSpeedOverrideMutation();

    const [form, setForm] = useState({
        avgSpeedOverride: "",
        reason: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // ===============================
    // PREFILL IF EXISTS
    // ===============================
    useEffect(() => {
        if (data) {
            setForm({
                avgSpeedOverride: String(data.avgSpeedOverride),
                reason: data.reason ?? "",
            });
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ===============================
    // SAVE
    // ===============================
    const handleSave = async () => {
        setErrors({});

        const parsed = cabSpeedOverrideSchema.safeParse({
            cabId,
            avgSpeedOverride: Number(form.avgSpeedOverride),
            reason: form.reason,
        });

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach(issue => {
                fieldErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            await saveOverride(parsed.data).unwrap();
            enqueueSnackbar("Cab speed override saved successfully", {
                variant: "success",
            });
        } catch {
            enqueueSnackbar("Failed to save speed override", {
                variant: "error",
            });
        }
    };

    // ===============================
    // DELETE
    // ===============================
    const handleDelete = async () => {
        if (!data) return;
        if (!window.confirm("Remove speed override for this cab?")) return;

        try {
            await deleteOverride(data.cabSpeedOverrideId).unwrap();
            enqueueSnackbar("Speed override removed", { variant: "success" });
            router.back();
        } catch {
            enqueueSnackbar("Failed to remove override", { variant: "error" });
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <PageBreadcrumb
                items={[
                    { label: "Cabs", href: "/cabs" },
                    { label: "Speed Override" },
                ]}
            />

            <ComponentCard
                title="Cab Speed Override"
                desc="Override average speed calculation for this cab"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                        label="Average Speed Override (km/hr)"
                        name="avgSpeedOverride"
                        value={form.avgSpeedOverride}
                        onChange={handleChange}
                        error={errors.avgSpeedOverride}
                    />

                    <CustomInput
                        label="Reason"
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        placeholder="Medical / VIP / Special condition"
                    />
                </div>

                <div className="flex justify-between mt-8 border-t pt-6">
                    <Button variant="default" onClick={() => router.back()}>
                        Back
                    </Button>

                    <div className="flex gap-3">
                        {data && (
                            <Button
                                variant="danger"
                                outline
                                onClick={handleDelete}
                                isLoading={isDeleting}
                            >
                                Remove Override
                            </Button>
                        )}

                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Save Override
                        </Button>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
}