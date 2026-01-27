"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateDriverDetailMutation } from "@/features/driverdetail";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { driverDetailSchema } from "@/features/driverdetail";

export default function CreateDriverDetailPage() {
  const router = useRouter();
  const [createDriver, { isLoading }] =
    useCreateDriverDetailMutation();

  const [form, setForm] = useState({
    // userId: "",
    driverName: "",
    mobileNumber: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

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
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setFormError("Please fix the errors below.");
      return;
    }

    try {
      const res = await createDriver(result.data).unwrap();

      enqueueSnackbar("Driver created successfully", {
        variant: "success",
      });

      router.push(`/driverdetails/${res.driverDetailId}`);
    } catch {
      setFormError("Failed to create driver.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Driver
        </h1>
        <p className="text-sm text-gray-500">
          Enter driver basic information
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
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Driver Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <Button
              variant="default"
              onClick={() => history.back()}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isLoading}
            >
              Save Driver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}