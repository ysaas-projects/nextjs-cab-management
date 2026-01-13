"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import LocationSelector from "@/components/molecules/LocationSelector";
import { millSchema, useCreateMillMutation } from "@/features/mill";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateMillPage() {

    const [createMill, { isLoading, isSuccess, error }] = useCreateMillMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const router = useRouter();


    const [form, setForm] = useState({
        millName: "",
        millCode: "",
        address: "",
        stateId: null as number | null,
        cityId: null as number | null,
        country: "India",
        pincode: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        gstNumber: "",
    });
   

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        const result = millSchema.safeParse(form);

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
            const response = await createMill(result.data).unwrap();

            console.log("Mill created successfully!", response);
            // ✅ SUCCESS SNACKBAR
            enqueueSnackbar("Mill created successfully", {
                variant: "success",
            });

            // ✅ Redirect to detail page
            router.push(`/mills/${response.millId}`);            
        } catch (err) {
            setFormError("Something went wrong while saving the mill.");
        }
    };


    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Add New Mill</h1>
                <p className="text-sm text-gray-500">
                    Provide mill, location and contact information
                </p>
            </div>

            {/* Card Container */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">
                    {formError && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    {/* Basic Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Mill Name" name="millName" value={form.millName} onChange={handleChange} error={errors.millName} />
                            <CustomInput label="Mill Code" name="millCode" value={form.millCode} onChange={handleChange} error={errors.millCode} />
                            <CustomInput label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} />
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
                            stateCol={{ base: 12, md: 6 }}
                            cityCol={{ base: 12, md: 6 }}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                            <CustomInput label="Pin Code" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} />
                            <CustomInput label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} />
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Contact Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange} error={errors.contactPerson} />
                            <CustomInput label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} error={errors.contactNumber} />
                            <CustomInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                            <CustomInput label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} error={errors.gstNumber} />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            variant="default"
                            onClick={() => history.back()}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isLoading}
                        >
                            Save Mill
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
