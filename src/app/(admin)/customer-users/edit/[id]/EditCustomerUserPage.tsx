"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
  useGetCustomerUserByIdQuery,
  useUpdateCustomerUserMutation,
} from "@/features/customerUser";
import { useGetCustomersQuery } from "@/features/customer/customerApi";

export default function EditCustomerUserPage() {
  const router = useRouter();
  const params = useParams();

  const customerUserId = Number(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const {
    data: customerUser,
    isLoading,
    isError,
  } = useGetCustomerUserByIdQuery(customerUserId, {
    skip: !customerUserId,
    refetchOnMountOrArgChange: true,
  });

  const { data: customers } = useGetCustomersQuery();
  const customerNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of customers ?? []) {
      map.set(c.customerId, c.customerName);
    }
    return map;
  }, [customers]);

  const [updateCustomerUser, { isLoading: isSaving }] =
    useUpdateCustomerUserMutation();

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    userName: "",
    mobileNumber: "",
    isActive: true,
  });

  useEffect(() => {
    if (!customerUser) return;

    setForm({
      userName: customerUser.userName ?? "",
      mobileNumber: customerUser.mobileNumber ?? "",
      isActive: !!customerUser.isActive,
    });
  }, [customerUser]);

  const customerName =
    (customerUser?.customerId
      ? customerNameById.get(customerUser.customerId)
      : undefined) ?? "—";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setFormErrors([]);

    if (!form.userName.trim()) {
      setFormErrors(["User Name is required."]);
      return;
    }

    try {
      await updateCustomerUser({
        id: customerUserId,
        payload: {
          userName: form.userName.trim(),
          mobileNumber: form.mobileNumber?.trim()
            ? form.mobileNumber.trim()
            : null,
          isActive: form.isActive,
        },
      }).unwrap();

      enqueueSnackbar("Customer user updated successfully", {
        variant: "success",
      });

      router.push("/customer-users");
    } catch (err: any) {
      if (err?.data?.errors && typeof err.data.errors === "object") {
        const validationErrors = Object.values(err.data.errors).flat();
        setFormErrors(validationErrors as string[]);
      } else if (err?.data?.message) {
        setFormErrors([err.data.message]);
      } else {
        setFormErrors(["Something went wrong while updating the customer user."]);
      }
    }
  };

  if (!customerUserId || Number.isNaN(customerUserId)) {
    return <div>Invalid Customer User ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading customer user.</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Customer User
        </h1>
        <p className="text-sm text-gray-500">Update customer user information</p>
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
                <div className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {customerName}
                  {customerUser?.customerId ? (
                    <span className="ml-2 text-xs text-gray-500">
                      (ID: {customerUser.customerId})
                    </span>
                  ) : null}
                </div>
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
                <label className="text-sm font-medium text-gray-700">
                  Is Active
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="default" onClick={() => router.back()}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!customerUser}
            >
              Update Customer User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
