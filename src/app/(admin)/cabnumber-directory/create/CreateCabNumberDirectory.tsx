"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomSelect from "@/components/atoms/CustomSelect";
import CustomInput from "@/components/atoms/CustomInput";
import { enqueueSnackbar } from "notistack";

import { useGetCabsQuery } from "@/features/cab";
import {
  useCreateCabNumberDirectoryMutation,
} from "@/features/cabnumberdirectory";

export default function CreateCabNumberDirectoryPage() {
  const router = useRouter();

  /* 🔹 Master data */
  const { data: cabs = [] } = useGetCabsQuery();

  const [createCabNumber, { isLoading }] =
    useCreateCabNumberDirectoryMutation();

  /* 🔹 Form state (NO firmId) */
  const [form, setForm] = useState({
    cabId: "",
    cabNumber: "",
    isActive: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.cabId || !form.cabNumber) {
      enqueueSnackbar("Cab and Cab Number are required", {
        variant: "error",
      });
      return;
    }

    try {
      await createCabNumber({
        cabId: Number(form.cabId),
        cabNumber: form.cabNumber,
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Cab number added successfully", {
        variant: "success",
      });

      // 🔥 Redirect back to directory
      router.push("/cabnumber-directory");
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to add cab number",
        { variant: "error" }
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Cab Number" />

      <ComponentCard title="Add Cab Number">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ✅ Cab dropdown */}
          <CustomSelect
            label="Cab"
            name="cabId"
            value={form.cabId}
            onChange={handleChange}
            options={cabs.map((c) => ({
              id: c.cabId,
              name: c.cabType,
            }))}
          />

          {/* ✅ Cab Number */}
          <CustomInput
            label="Cab Number"
            name="cabNumber"
            value={form.cabNumber}
            onChange={handleChange}
            placeholder="MH12 AB 1234"
          />
        </div>

        {/* ✅ Active checkbox */}
        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="default" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Save Cab Number
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
