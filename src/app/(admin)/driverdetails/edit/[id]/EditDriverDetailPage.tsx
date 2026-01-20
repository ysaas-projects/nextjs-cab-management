"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import CustomInput from "@/components/atoms/CustomInput";

import {
  useGetDriverDetailByIdQuery,
  useUpdateDriverDetailMutation,
} from "@/features/driverdetail";

import { driverDetailSchema } from "@/features/driverdetail";

/* ================================
   TYPES
================================ */
interface DriverDetailForm {
  // userId: string;
  driverName: string;
  mobileNumber: string;
  isActive: boolean;
}

/* ================================
   COMPONENT
================================ */
export default function EditDriverDetailPage() {
  const router = useRouter();
  const params = useParams();

  const driverDetailId = Number(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const [updateDriver] = useUpdateDriverDetailMutation();
  const {
    data: driver,
    isLoading,
    isError,
  } = useGetDriverDetailByIdQuery(driverDetailId, {
    skip: !driverDetailId,
  });

  const [form, setForm] = useState<DriverDetailForm>({
    // userId: "",
    driverName: "",
    mobileNumber: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  /* -----------------------------
     Populate Form
  ----------------------------- */
  useEffect(() => {
    if (driver && !isLoading) {
      setForm({
      //  userId: driver.userId ? String(driver.userId) : "",
        driverName: driver.driverName ?? "",
        mobileNumber: driver.mobileNumber ?? "",
        isActive: driver.isActive ?? true,
      });
    }
  }, [driver, isLoading]);

  /* -----------------------------
     Handlers
  ----------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setErrors({});
    setFormError(null);

    const parsedData = {
      // userId: Number(form.userId),
      driverName: form.driverName,
      mobileNumber: form.mobileNumber,
      isActive: form.isActive,
    };

    const result = driverDetailSchema.safeParse(parsedData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      setFormError("Please fix validation errors.");
      return;
    }

    try {
      await updateDriver({
        driverDetailId,
        ...result.data,
      }).unwrap();

      enqueueSnackbar("Driver updated successfully", {
        variant: "success",
      });

      router.push(`/driverdetails/${driverDetailId}`);
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to update driver",
        { variant: "error" }
      );
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load driver</p>;

  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Driver
        </h1>
        <p className="text-sm text-gray-500">
          Update driver basic information
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-10 p-6">

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* Driver Info */}
          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
              Driver Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <CustomInput
                label="User ID"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                error={errors.userId}
              /> */}

              <CustomInput
                label="Driver Name"
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                error={errors.driverName}
              />

              <CustomInput
                label="Mobile Number"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                error={errors.mobileNumber}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              onClick={() => router.back()}
              className="rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Update Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
