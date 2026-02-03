"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import { useCreateSeasonMutation } from "@/features/season/seasonApi";

export default function CreateSeasonPage() {
  const router = useRouter();
  const [createSeason, { isLoading }] = useCreateSeasonMutation();

  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    seasonName: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setFormError(null);

    // ✅ Basic frontend validation
    if (!form.seasonName || !form.startDate || !form.endDate) {
      setFormError("All fields are required.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError("End date cannot be before start date.");
      return;
    }

    try {
      await createSeason({
        seasonName: form.seasonName,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Season created successfully", {
        variant: "success",
      });

      router.push("/seasons");
    } catch (err: any) {
      setFormError(
        err?.data?.message ||
          "Something went wrong while creating the season."
      );
    }
  };

  /* ================= UI ================= */

  return (
    <>
      <PageBreadcrumb pageTitle="Add Season" />

      <ComponentCard title="Season Information">
        <div className="space-y-6 max-w-2xl">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* SEASON NAME */}
          <CustomInput
            label="Season Name"
            name="seasonName"
            value={form.seasonName}
            onChange={handleChange}
            placeholder="Peak / Off-Season / Festival"
          />

          {/* START DATE */}
          <CustomInput
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
          />

          {/* END DATE */}
          <CustomInput
            label="End Date"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
          />

          {/* IS ACTIVE */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">
              Is Active
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="default" onClick={() => router.back()}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isLoading}
            >
              Save Season
            </Button>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
