"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateCustomerMutation } from "@/features/customer/customerApi";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreateCustomerPage() {
  const router = useRouter();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    address: "",
    gstNumber: "",
    isActive: true,
    logoImage: null as File | null, // ✅ ADD
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      logoImage: file,
    }));
  };

  const handleSave = async () => {
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("customerName", form.customerName);
      formData.append("address", form.address);
      formData.append("gstNumber", form.gstNumber);
      formData.append("isActive", String(form.isActive));

      // ✅ IMPORTANT: append file
      if (form.logoImage) {
        formData.append("logoImage", form.logoImage);
      }

      const response = await createCustomer(formData).unwrap();

      enqueueSnackbar("Customer created successfully", {
        variant: "success",
      });

      router.push(`/customers/${response.customerId}`);
    } catch (err: any) {
      setFormError(
        err?.data?.message ||
          "Something went wrong while saving the customer."
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add New Customer
        </h1>
        <p className="text-sm text-gray-500">
          Provide customer information
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-8 p-6">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* CUSTOMER INFO */}
          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Customer Name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
              />

              <CustomInput
                label="GST Number"
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
              />

              <CustomInput
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            {/* LOGO UPLOAD */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600"
              />

              {form.logoImage && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected: {form.logoImage.name}
                </p>
              )}
            </div>

            {/* IS ACTIVE */}
            <div className="mt-4 flex items-center gap-3">
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
          </section>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="default" onClick={() => history.back()}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isLoading}
            >
              Save Customer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
