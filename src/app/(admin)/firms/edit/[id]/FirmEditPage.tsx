"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
  useGetFirmByIdQuery,
  useUpdateFirmMutation,
  useUpdateFirmLogoMutation,
} from "@/features/firm/firmApi";

export default function EditFirmPage() {
  const router = useRouter();
  const params = useParams();
  const firmId = Number(params.id);

  /* ===============================
     API HOOKS
  =============================== */
  const { data, isLoading } = useGetFirmByIdQuery(firmId);

  const [updateFirm, { isLoading: savingFirm }] =
    useUpdateFirmMutation();

  const [updateFirmLogo, { isLoading: savingDetails }] =
    useUpdateFirmLogoMutation();

  /* ===============================
     FORM STATE
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

  const [logoFile, setLogoFile] = useState<File | null>(null);

  /* ===============================
     PREFILL DATA
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
    if (file) {
      setLogoFile(file);
    }
  };

  /* ===============================
     SAVE (FINAL + CORRECT)
  =============================== */
  const handleSave = async () => {
    if (!form.firmName || !form.firmCode) {
      enqueueSnackbar("Firm Name & Firm Code required", {
        variant: "error",
      });
      return;
    }

    try {
      /* ========= 1️⃣ UPDATE FIRM ========= */
      await updateFirm({
        firmId,
        firmName: form.firmName.trim(),
        firmCode: form.firmCode.trim(),
        isActive: form.isActive,
      }).unwrap();

      /* ========= 2️⃣ UPDATE FIRM DETAILS ========= */
      if (data?.firmDetails?.firmDetailsId) {
        const fd = new FormData();

        fd.append("Address", form.address.trim());
        fd.append("ContactNumber", form.contactNumber.trim()); // ✅ NO +91
        fd.append("ContactPerson", form.contactPerson ?? "");
        fd.append("GstNumber", form.gstNumber.trim());
        fd.append("IsActive", String(form.isActive));

        if (logoFile) {
          fd.append("Logo", logoFile); // ✅ MATCHES DTO
        }

        await updateFirmLogo({
          firmDetailsId: data.firmDetails.firmDetailsId,
          formData: fd,
        }).unwrap();
      }

      enqueueSnackbar("Firm updated successfully", {
        variant: "success",
      });

      router.push("/firms");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Update failed", {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  /* ===============================
     UI (UNCHANGED)
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

        {/* ================= Logo ================= */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Firm Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />

          {!logoFile && form.logoImagePath && (
            <p className="mt-1 text-xs text-gray-500 break-all">
              Current Logo: {form.logoImagePath}
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
        <Button variant="default" onClick={() => history.back()}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={savingFirm || savingDetails}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
