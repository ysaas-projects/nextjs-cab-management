"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateFirmTermMutation } from "@/features/firmTerms";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateFirmTermPage() {
  const router = useRouter();
  const [createFirmTerm, { isLoading }] = useCreateFirmTermMutation();

  const [form, setForm] = useState({
    firmId: "",
    description: "",
    isActive: true,
  });

  const [formError, setFormError] = useState<string | null>(null);

  // ===============================
  // HANDLE CHANGE
  // ===============================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===============================
  // SAVE
  // ===============================
  const handleSave = async () => {
    setFormError(null);

    if (!form.firmId || !form.description) {
      setFormError("Firm ID and Description are required");
      return;
    }

    try {
      await createFirmTerm({
        firmId: Number(form.firmId),
        description: form.description,
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Firm Term created successfully", {
        variant: "success",
      });

      router.push("/firmTerms");
    } catch {
      setFormError("Something went wrong while creating firm term");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add Firm Term</h1>

      {formError && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Firm ID"
          name="firmId"
          value={form.firmId}
          onChange={handleChange}
        />

        <CustomInput
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <label className="flex items-center gap-2 mt-4 text-sm">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        Active
      </label>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="default" onClick={() => history.back()}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isLoading}
        >
          Save Firm Term
        </Button>
      </div>
    </div>
  );
}