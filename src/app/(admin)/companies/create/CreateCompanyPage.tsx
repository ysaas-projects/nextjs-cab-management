"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import LocationSelector from "@/components/molecules/LocationSelector";
import { useCreateCompanyMutation } from "@/features/company/companyApi";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { companySchema } from "@/features/company";

export default function CreateCompanyPage() {
    const router = useRouter();
    const [createCompany, { isLoading }] = useCreateCompanyMutation();

    const [form, setForm] = useState({
        companyName: "",
        companyCode: "",
        businessType: "",
        phone: "",
        email: "",
        gstNumber: "",
        panNumber: "",
        country: "India",
        stateId: null as number | null,
        cityId: null as number | null,
        pincode: "",
        address: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        const result = companySchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            setFormError("Please fix the errors below.");
            return;
        }

        try {
            const res = await createCompany(result.data).unwrap();

            enqueueSnackbar("Company created successfully", {
                variant: "success",
            });

            router.push(`/companies/${res.companyId}`);
        } catch (error) {
            setFormError("Failed to create company.");
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create Company
                </h1>
                <p className="text-sm text-gray-500">
                    Enter company and contact information
                </p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">

                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    {/* Company Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Company Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} error={errors.companyName} />
                            <CustomInput label="Company Code" name="companyCode" value={form.companyCode} onChange={handleChange} error={errors.companyCode} />
                            <CustomInput label="Business Type" name="businessType" value={form.businessType} onChange={handleChange} error={errors.businessType} />
                            <CustomInput label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
                            <CustomInput label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} error={errors.gstNumber} />
                            <CustomInput label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} error={errors.panNumber} />
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Location Details
                        </h3>

                        <LocationSelector
                            stateId={form.stateId}
                            cityId={form.cityId}
                            onStateChange={(val) =>
                                setForm((prev) => ({ ...prev, stateId: val, cityId: null }))
                            }
                            onCityChange={(val) =>
                                setForm((prev) => ({ ...prev, cityId: val }))
                            }
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                            <CustomInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} />
                            <CustomInput label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button variant="default" onClick={() => history.back()}>
                            Cancel
                        </Button>

                        <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                            Save Company
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
