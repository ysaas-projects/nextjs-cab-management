"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
  useGetTourPackageByIdQuery,
  useUpdateTourPackageMutation,
} from "@/features/tourpackage/tourpackageApi";

export default function TourPackageEditPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ GET ID FROM URL
  const packageId = Number(params.id);

  // 🔒 Safety check
  if (!packageId) {
    return <div>Invalid tour package ID</div>;
  }

  const { data, isLoading, isError } =
    useGetTourPackageByIdQuery(packageId);

  const [updateTourPackage, { isLoading: isSaving }] =
    useUpdateTourPackageMutation();

  const [form, setForm] = useState({
    packageName: "",
    description: "",
    location: "",
    durationDays: 0,
    durationNights: 0,
    basePrice: 0,
    isActive: true,
  });

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (data?.data) {
      const pkg = data.data;

      setForm({
        packageName: pkg.packageName,
        description: pkg.description ?? "",
        location: pkg.location ?? "",
        durationDays: pkg.durationDays ?? 0,
        durationNights: pkg.durationNights ?? 0,
        basePrice: pkg.basePrice,
        isActive: pkg.isActive,
      });
    }
  }, [data]);

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateTourPackage({
        tourPackageId: packageId, // ✅ THIS WAS MISSING
        ...form,
      }).unwrap();

      enqueueSnackbar("Tour package updated successfully", {
        variant: "success",
      });

      router.push(`/tour-packages/${packageId}`);
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to update tour package",
        { variant: "error" }
      );
    }
  };

  /* ================= UI ================= */
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data?.data)
    return <div>Tour package not found.</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Tour Package" />

      <ComponentCard title="Edit Tour Package">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            label="Package Name"
            name="packageName"
            value={form.packageName}
            onChange={handleChange}
          />

          <CustomInput
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <CustomInput
            label="Duration Days"
            name="durationDays"
            type="number"
            value={String(form.durationDays)}
            onChange={handleChange}
          />

          <CustomInput
            label="Duration Nights"
            name="durationNights"
            type="number"
            value={String(form.durationNights)}
            onChange={handleChange}
          />

          <CustomInput
            label="Base Price"
            name="basePrice"
            type="number"
            value={String(form.basePrice)}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="default" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
          >
            Update Package
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
