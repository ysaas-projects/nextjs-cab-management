"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import CustomInput from "@/components/atoms/CustomInput";
import LocationSelector from "@/components/molecules/LocationSelector";

import {
    useGetCompanyByIdQuery,
    useUpdateCompanyMutation,
} from "@/features/company/companyApi";

import { companySchema } from "@/features/company";

/* ================================
   TYPES
================================ */
interface CompanyForm {
    companyName: string;
    companyCode: string;
    businessType: string;
    address: string;
    stateId: number | null;
    cityId: number | null;
    country: string;
    pincode: string;
    contactEmail: string;
    contactPhone: string;
    gstNumber: string;
    panNumber: string;
    isActive: boolean;
}

/* ================================
   COMPONENT
================================ */
export default function EditCompanyPage() {
    const router = useRouter();
    const params = useParams();

    const companyId = Number(
        Array.isArray(params.id) ? params.id[0] : params.id
    );

    const [updateCompany] = useUpdateCompanyMutation();
    const { data: company, isLoading, isError } = useGetCompanyByIdQuery(companyId, {
        skip: !companyId,
    });

    const [form, setForm] = useState<CompanyForm>({
        companyName: "",
        companyCode: "",
        businessType: "",
        gstNumber: "",
        panNumber: "",
        address: "",
        cityId: null,
        stateId: null,
        pincode: "",
        country: "",
        contactEmail: "",
        contactPhone: "",
        isActive: true,
    });



    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    /* -----------------------------
       Populate Form
    ----------------------------- */
    useEffect(() => {
        if (company && !isLoading) {
            setForm({
                companyName: company.companyName ?? "",
                companyCode: company.companyCode ?? "",
                businessType: company.businessType ?? "",
                address: company.address ?? "",
                stateId: company.stateId ?? null,
                cityId: company.cityId ?? null,
                country: company.country ?? "",
                pincode: company.pincode ?? "",
                contactEmail: company.contactEmail ?? "",
                contactPhone: company.contactPhone ?? "",
                gstNumber: company.gstNumber ?? "",
                panNumber: company.panNumber ?? "",
                isActive: company.isActive ?? true,
            });
        }
    }, [company, isLoading]);


    /* -----------------------------
       Handlers
    ----------------------------- */
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
            result.error.issues.forEach((i) => {
                fieldErrors[i.path[0] as string] = i.message;
            });
            setErrors(fieldErrors);
            setFormError("Please fix validation errors.");
            return;
        }

        try {
            await updateCompany({
                ...result.data,
                companyId,
            }).unwrap();

            enqueueSnackbar("Company updated successfully", { variant: "success" });
            router.push(`/companies/${companyId}`);
        } catch (err: any) {
            enqueueSnackbar(
                err?.data?.message || "Failed to update company",
                { variant: "error" }
            );
        }
    };

    /* -----------------------------
       UI
    ----------------------------- */
    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Edit Company
                </h1>
                <p className="text-sm text-gray-500">
                    Update company profile and contact information
                </p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">

                    {/* Company Info */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
                            Company Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />
                            <CustomInput label="Company Code" name="companyCode" value={form.companyCode} readOnly />
                            <CustomInput label="Business Type" name="businessType" value={form.businessType} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput label="Email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
                            <CustomInput label="Phone" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
                            <CustomInput label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} />
                            <CustomInput label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Location */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <CustomInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
                            <CustomInput label="Country" name="country" value={form.country} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <button
                            onClick={() => router.back()}
                            className="rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Update Company
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
