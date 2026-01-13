"use client";

import CustomInput from "@/components/atoms/CustomInput";
import LocationSelector from "@/components/molecules/LocationSelector";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useUpdateMillMutation } from "@/features/mill/millApi";
import { useGetMillByIdQuery } from "@/features/mill/millApi"; // Import the query hook
import { millSchema } from "@/features/mill";
import { enqueueSnackbar } from "notistack";

interface StateOption {
    id: number;
    name: string;
}

interface CityOption {
    id: number;
    name: string;
}

// Ensure the Mill type includes stateId and cityId properties.
interface Mill {
    millName: string;
    millCode: string;
    address: string;
    stateId: number | null;
    cityId: number | null;
    country: string;
    pincode: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    gstNumber: string;
    isActive: boolean;
}

// Update CustomInput to support the readOnly prop.
interface CustomInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readOnly?: boolean; // Added optional readOnly prop
    error?: string;
}

export default function EditMillPage() {
    const router = useRouter();
    const params = useParams();
    const [updateMill] = useUpdateMillMutation();

    const [form, setForm] = useState({
        millName: "",
        millCode: "",
        address: "",
        stateId: null as number | null,
        cityId: null as number | null,
        country: "",
        pincode: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        gstNumber: "",
        isActive: true, // Assuming isActive is a boolean
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const millId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || "0", 10);

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
            const payload = {
                ...result.data,
                millId,
                isActive: form.isActive,
            };

            const response = await updateMill(payload).unwrap();

            console.log("Mill updated successfully!", response);
            enqueueSnackbar("Mill updated successfully", {
                variant: "success",
            });

            router.push(`/mills/${millId}`);
        } catch (err: any) {
            console.error("Failed to update mill", err);
            setFormError(err.data?.message || "Something went wrong while updating the mill.");
        }
    };

    const { data: mill, isLoading, isError } = useGetMillByIdQuery(millId, {
        skip: !millId,
    });

    useEffect(() => {
        console.log("Page loaded. Mill ID:", millId);
        console.log("Triggering useGetMillByIdQuery with ID:", millId);
        console.log("API call status - isLoading:", false, "isError:", false, "mill:", form);
        console.log("Mill ID passed to query:", millId);
        console.log("Query execution status - isLoading:", isLoading, "isError:", isError, "mill:", mill);
    }, [millId, isLoading, isError, mill]);

    useEffect(() => {
        if (mill && !isLoading) {
            console.log("Updating form with mill data", mill);
            setForm({
                millName: mill.millName,
                millCode: mill.millCode, // Read-only field
                address: mill.address,
                stateId: mill.stateId || null, // Ensure stateId is a number or null
                cityId: mill.cityId || null, // Ensure cityId is a number or null
                country: mill.country,
                pincode: mill.pincode,
                contactPerson: mill.contactPerson,
                contactNumber: mill.contactNumber,
                email: mill.email,
                gstNumber: mill.gstNumber,
                isActive: mill.isActive,
            });
        }
    }, [mill, isLoading]);

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Mill</h1>
                <p className="text-sm text-gray-500">
                    Provide mill, location and contact information
                </p>
            </div>

            {/* Card Container */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">

                    {/* Basic Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Mill Name" name="millName" value={form.millName} onChange={handleChange} />
                            <CustomInput label="Mill Code" name="millCode" value={form.millCode} onChange={handleChange} readOnly />
                            <CustomInput label="Address" name="address" value={form.address} onChange={handleChange} />
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
                            <CustomInput label="Pin Code" name="pincode" value={form.pincode} onChange={handleChange} />
                            <CustomInput label="Country" name="country" value={form.country} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            Contact Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange} />
                            <CustomInput label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} />
                            <CustomInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                            <CustomInput label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <button
                            onClick={() => history.back()}
                            className="rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Save Mill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
