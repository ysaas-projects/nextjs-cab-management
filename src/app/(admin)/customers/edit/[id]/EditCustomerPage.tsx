"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { enqueueSnackbar } from "notistack";

import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/features/customer/customerApi";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = Number(params.id);

  const { data, isLoading } = useGetCustomerByIdQuery(customerId);
  const [updateCustomer, { isLoading: isSaving }] =
    useUpdateCustomerMutation();

  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    address: "",
    gstNumber: "",
    isActive: true,
    logoImage: null as File | null,
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (data) {
      setForm({
        customerName: data.customerName,
        address: data.address ?? "",
        gstNumber: data.gstNumber ?? "",
        isActive: data.isActive,
        logoImage: null,
      });
    }
  }, [data]);

  if (!customerId || Number.isNaN(customerId)) {
    return <div>Invalid Customer ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] ?? null
          : value,
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

      if (form.logoImage) {
        formData.append("logoImage", form.logoImage);
      }

      await updateCustomer({
        customerId,
        payload: formData,
      }).unwrap();

      enqueueSnackbar("Customer updated successfully", {
        variant: "success",
      });

      router.push(`/customers/${customerId}`);
    } catch (err: any) {
      setFormError(
        err?.data?.message ||
          "Something went wrong while updating customer."
      );
    }
  };

  /* ================= UI ================= */
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Customer
        </h1>
        <p className="text-sm text-gray-500">
          Update customer information
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-8 p-6">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* Customer Info */}
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

              {/* ✅ FILE INPUT (DO NOT USE CustomInput) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Customer Logo (optional)
                </label>
                <input
                  type="file"
                  name="logoImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full rounded border border-gray-300 text-sm"
                />
              </div>
            </div>

            {/* IsActive */}
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
              isLoading={isSaving}
            >
              Update Customer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
