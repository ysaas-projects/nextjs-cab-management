"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import {
  useGetFirmByIdQuery,
  useUpdateFirmMutation,
} from "@/features/firm/firmApi";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

export default function EditFirmPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const firmId = Number(params.id);

  const { data, isLoading } = useGetFirmByIdQuery(firmId);
  const [updateFirm, { isLoading: saving }] = useUpdateFirmMutation();

  // ===============================
  // FORM STATE (Firm + FirmDetails)
  // ===============================
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

  // ===============================
  // PREFILL FORM ON LOAD
  // ===============================
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
        logoImagePath: form.logoImagePath,
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

  // ===============================
  // UI
  // ===============================
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Firm</h1>

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
      <h2 className="text-lg font-medium mt-8 mb-2">Firm Details</h2>

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

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3 mt-8">
        <Button variant="default" onClick={() => history.back()}>
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
