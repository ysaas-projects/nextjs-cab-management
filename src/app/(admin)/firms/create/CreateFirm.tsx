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
    firmName: "",
    firmCode: "",
    isActive: true,
    address: "",
    contactNumber: "",
    contactPerson: "",
    gstNumber: "",
  });

  // ✅ Logo file state
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  // ✅ FIXED: FormData based submit
  const handleSave = async () => {
    setFormError(null);

    if (!form.firmName || !form.firmCode) {
      setFormError("Firm Name and Firm Code are required");
      return;
    }

    try {
      const formData = new FormData();

      // -------- Firm --------
      formData.append("FirmName", form.firmName);
      formData.append("FirmCode", form.firmCode);
      formData.append("IsActive", String(form.isActive));

      // -------- Firm Details --------
      if (form.address) formData.append("Address", form.address);
      if (form.contactNumber) formData.append("ContactNumber", form.contactNumber);
      if (form.contactPerson) formData.append("ContactPerson", form.contactPerson);
      if (form.gstNumber) formData.append("GstNumber", form.gstNumber);

      // -------- Logo --------
      if (logoFile) {
        formData.append("Logo", logoFile); // 👈 MUST match backend DTO
      }

      await createFirm(formData).unwrap();

      enqueueSnackbar("Firm created successfully", { variant: "success" });
      router.push("/firms");
    } catch (error) {
      console.error(error);
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

        {/* ================= Logo ================= */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Firm Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:rounded file:border-0
              file:bg-blue-50 file:px-4 file:py-2
              file:text-sm file:font-medium
              file:text-blue-700 hover:file:bg-blue-100"
          />

          {logoFile && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {logoFile.name}
            </p>
          )}
        </div>
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
