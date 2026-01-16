"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateFirmMutation } from "@/features/firm/firmApi";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateFirmPage() {
  const router = useRouter();
  const [createFirm, { isLoading }] = useCreateFirmMutation();

  const [form, setForm] = useState({
    // Firm
    firmName: "",
    firmCode: "",
    isActive: true,

    // FirmDetails
    address: "",
    contactNumber: "",
    contactPerson: "",
    gstNumber: "",
    logoImagePath: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setFormError(null);

    if (!form.firmName || !form.firmCode) {
      setFormError("Firm Name and Firm Code are required");
      return;
    }

    try {
      await createFirm(form).unwrap();

      enqueueSnackbar("Firm created successfully", {
        variant: "success",
      });

      router.push("/firms");
    } catch {
      setFormError("Something went wrong while creating firm");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add New Firm</h1>

      {formError && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      {/* ================= Firm ================= */}
      <h2 className="text-lg font-medium mb-2">Firm Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Firm Name"
          name="firmName"
          value={form.firmName}
          onChange={handleChange}
        />

        <CustomInput
          label="Firm Code"
          name="firmCode"
          value={form.firmCode}
          onChange={handleChange}
        />
      </div>

      {/* ================= Firm Details ================= */}
      <h2 className="text-lg font-medium mt-6 mb-2">Firm Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <CustomInput
          label="Contact Number"
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleChange}
        />

        <CustomInput
          label="Contact Person"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
        />

        <CustomInput
          label="GST Number"
          name="gstNumber"
          value={form.gstNumber}
          onChange={handleChange}
        />

        <CustomInput
          label="Logo Image Path"
          name="logoImagePath"
          value={form.logoImagePath}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="default" onClick={() => history.back()}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
          Save Firm
        </Button>
      </div>
    </div>
  );
}