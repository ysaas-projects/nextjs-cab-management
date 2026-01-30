"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import { useCreateCustomerUserMutation } from "@/features/customerUser";
import { useGetCustomersQuery } from "@/features/customer/customerApi";

export default function CreateCustomerUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedCustomerId = Number(searchParams.get("customerId") ?? 0);

  const [createCustomerUser, { isLoading }] = useCreateCustomerUserMutation();

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    customerId: Number.isFinite(preselectedCustomerId) ? preselectedCustomerId : 0,
    userName: "",
    mobileNumber: "",
    isActive: true,
  });

  const {
    data: customers,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useGetCustomersQuery();

  const customerOptions = useMemo(() => {
    const items = customers ?? [];
    return items.map((c) => ({ id: c.customerId, name: c.customerName }));
  }, [customers]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "customerId"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    setFormErrors([]);

    if (!form.customerId || !form.userName.trim()) {
      setFormErrors(["Customer and User Name are required."]);
      return;
    }

    try {
      const response = await createCustomerUser({
        customerId: form.customerId,
        userName: form.userName.trim(),
        mobileNumber: form.mobileNumber?.trim() ? form.mobileNumber.trim() : null,
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Customer user created successfully", {
        variant: "success",
      });

      router.push(`/customer-users`);
    } catch (err: any) {
      if (err?.data?.errors && typeof err.data.errors === "object") {
        const validationErrors = Object.values(err.data.errors).flat();
        setFormErrors(validationErrors as string[]);
      } else if (err?.data?.message) {
        setFormErrors([err.data.message]);
      } else {
        setFormErrors(["Something went wrong while saving the customer user."]);
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Customer User</h1>
        <p className="text-sm text-gray-500">Provide customer user information</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-8 p-6">
          {formErrors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <ul className="list-disc list-inside space-y-1">
                {formErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Customer User Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  disabled={isLoadingCustomers}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value={0}>
                    {isLoadingCustomers
                      ? "Loading customers..."
                      : "Select Customer"}
                  </option>
                  {customerOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>

                {isCustomersError && (
                  <div className="mt-2 text-sm text-red-600">
                    Failed to load customers.
                    <button
                      type="button"
                      onClick={() => refetchCustomers()}
                      className="ml-2 underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>

              <CustomInput
                label="User Name"
                name="userName"
                value={form.userName}
                onChange={handleChange as any}
              />

              <CustomInput
                label="Mobile Number"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange as any}
              />

              <div className="mt-2 flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700">Is Active</label>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="default" onClick={() => history.back()}>
              Cancel
            </Button>

            <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
              Save Customer User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
