"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
  useGetFirmByIdQuery,
  useUpdateFirmMutation,
} from "@/features/firm/firmApi";

export default function EditFirmPage() {
  const router = useRouter();
  const params = useParams();
  const firmId = Number(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const { data, isLoading } = useGetFirmByIdQuery(firmId);
  const [updateFirm, { isLoading: saving }] =
    useUpdateFirmMutation();

  /* ===============================
     FORM STATE (Firm + FirmDetails)
  =============================== */
  const [form, setForm] = useState({
    firmName: "",
    firmCode: "",
    isActive: true,

    address: "",
    contactNumber: "",
    contactPerson: "",
    gstNumber: "",
    logoImagePath: "",
  });

  /* ===============================
     LOGO FILE (same as Create)
  =============================== */
  const [logoFile, setLogoFile] = useState<File | null>(null);

  /* ===============================
     PREFILL FORM
  =============================== */
  useEffect(() => {
    if (data) {
      setForm({
        firmName: data.firmName ?? "",
        firmCode: data.firmCode ?? "",
        isActive: data.isActive,

        address: data.firmDetails?.address ?? "",
        contactNumber: data.firmDetails?.contactNumber ?? "",
        contactPerson: data.firmDetails?.contactPerson ?? "",
        gstNumber: data.firmDetails?.gstNumber ?? "",
        logoImagePath: data.firmDetails?.logoImagePath ?? "",
      });
    }
  }, [data]);

  /* ===============================
     HANDLERS
  =============================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
  };

  /* ===============================
     SAVE
  =============================== */
  const handleSave = async () => {
    if (!form.firmName || !form.firmCode) {
      enqueueSnackbar("Firm Name & Firm Code are required", {
        variant: "error",
      });
      return;
    }

    try {
      await updateFirm({
        firmId,
        firmName: form.firmName,
        firmCode: form.firmCode,
        isActive: form.isActive,

        address: form.address,
        contactNumber: form.contactNumber,
        contactPerson: form.contactPerson,
        gstNumber: form.gstNumber,

        // 🔹 keep existing logo if no new file selected
        logoImagePath: logoFile
          ? logoFile.name // placeholder until upload API
          : form.logoImagePath,
      }).unwrap();

      enqueueSnackbar("Firm updated successfully", {
        variant: "success",
      });

      router.push("/firms");
    } catch {
      enqueueSnackbar("Failed to update firm", {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Edit Firm
      </h1>

      {/* ================= Firm ================= */}
      <h2 className="text-lg font-medium mb-2">
        Firm Information
      </h2>

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

      <label className="flex items-center gap-2 mt-4 text-sm">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        Active
      </label>

      {/* ================= Firm Details ================= */}
      <h2 className="text-lg font-medium mt-8 mb-2">
        Firm Details
      </h2>

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

        {/* ================= Logo Upload ================= */}
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

          {!logoFile && form.logoImagePath && (
            <p className="mt-1 text-xs text-gray-500">
              Current: {form.logoImagePath}
            </p>
          )}

          {logoFile && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {logoFile.name}
            </p>
          )}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3 mt-8">
        <Button
          variant="default"
          onClick={() => history.back()}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={saving}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}