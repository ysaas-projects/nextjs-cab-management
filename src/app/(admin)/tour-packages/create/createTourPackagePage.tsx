"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import { useCreateTourPackageMutation } from "@/features/tourpackage/tourpackageApi";

export default function CreateTourPackagePage() {
  const router = useRouter();
  const [createTourPackage, { isLoading }] =
    useCreateTourPackageMutation();

  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    packageName: "",
    description: "",
    location: "",
    durationDays: "",
    durationNights: "",
    basePrice: "",
    isActive: true,
  });

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } =
      e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setFormError(null);

    try {
      await createTourPackage({
        packageName: form.packageName,
        description: form.description || undefined,
        location: form.location || undefined,
        durationDays: form.durationDays
          ? Number(form.durationDays)
          : undefined,
        durationNights: form.durationNights
          ? Number(form.durationNights)
          : undefined,
        basePrice: Number(form.basePrice),
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Tour package created successfully", {
        variant: "success",
      });

      router.push("/tour-packages");
    } catch (err: any) {
      setFormError(
        err?.data?.message ||
          "Something went wrong while saving the tour package."
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">
        Add New Tour Package
      </h1>

      <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
        {formError && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {formError}
          </div>
        )}

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

        {/* DESCRIPTION (same style as FirmTerm) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Duration Days"
            type="number"
            name="durationDays"
            value={form.durationDays}
            onChange={handleChange}
          />

          <CustomInput
            label="Duration Nights"
            type="number"
            name="durationNights"
            value={form.durationNights}
            onChange={handleChange}
          />
        </div>

        <CustomInput
          label="Base Price"
          type="number"
          name="basePrice"
          value={form.basePrice}
          onChange={handleChange}
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label className="text-sm font-medium">
            Is Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="default" onClick={() => history.back()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            isLoading={isLoading}
            onClick={handleSave}
          >
            Save Tour Package
          </Button>
        </div>
      </div>
    </div>
  );
}
