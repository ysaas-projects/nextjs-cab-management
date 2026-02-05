"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/atoms/Button";

import { useCreateDutySlipMutation } from "@/features/dutyslip/dutyslipApi";
import { CreateDutySlipRequest } from "@/features/dutyslip";

import { useGetCustomersPaginatedQuery } from "@/features/customer/customerApi";
import { useGetCabsQuery } from "@/features/cab/cabApi";
import {
  useGetCustomerUsersByCustomerIdQuery,
} from "@/features/customerUser/customerUserApi";

export default function CreateDutySlipPage() {
  const router = useRouter();

  // ===============================
  // API
  // ===============================
  const [createDutySlip, { isLoading }] =
    useCreateDutySlipMutation();

  const { data: customerData } =
    useGetCustomersPaginatedQuery({
      pageNumber: 1,
      pageSize: 100,
    });

  const { data: cabsData } = useGetCabsQuery();

  const customers = customerData?.items ?? [];
  const cabs = cabsData ?? [];

  // ===============================
  // STATE
  // ===============================
  const [form, setForm] = useState<CreateDutySlipRequest>({
    bookedDate: new Date().toISOString(),
    customerId: 0,
    requestedCab: undefined,
    destination: "",
    customerUserIds: [], // ✅ IMPORTANT
  });

  const [selectedCustomerUsers, setSelectedCustomerUsers] =
    useState<number[]>([]);

  // ===============================
  // CUSTOMER USERS (BY CUSTOMER)
  // ===============================
  const { data: customerUsers = [] } =
    useGetCustomerUsersByCustomerIdQuery(form.customerId, {
      skip: !form.customerId,
    });

  // ===============================
  // HANDLERS
  // ===============================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "customerId" || name === "requestedCab"
          ? Number(value)
          : value,
    }));

    // Reset users when customer changes
    if (name === "customerId") {
      setSelectedCustomerUsers([]);
    }
  };

  const toggleCustomerUser = (id: number) => {
    setSelectedCustomerUsers((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customerId || !form.destination.trim()) {
      enqueueSnackbar("Please fill all required fields", {
        variant: "warning",
      });
      return;
    }

    if (selectedCustomerUsers.length === 0) {
      enqueueSnackbar("Select at least one customer user", {
        variant: "warning",
      });
      return;
    }

    try {
      await createDutySlip({
        ...form,
        customerUserIds: selectedCustomerUsers,
      }).unwrap();

      enqueueSnackbar("Duty slip created successfully", {
        variant: "success",
      });

      router.push("/dutyslips");
    } catch (error: any) {
      enqueueSnackbar(
        error?.data?.message || "Failed to create duty slip",
        { variant: "error" }
      );
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <>
      <PageBreadcrumb pageTitle="Create Duty Slip" />

      <ComponentCard title="New Duty Slip">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 max-w-lg"
        >
          {/* CUSTOMER */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value={0}>Select Customer</option>
              {customers.map((c) => (
                <option
                  key={c.customerId}
                  value={c.customerId}
                >
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          {/* CUSTOMER USERS */}
          {customerUsers.length > 0 && (
            <div>
              <label className="block mb-1 text-sm font-medium">
                Customer Users
              </label>

              <div className="border rounded p-2 space-y-1">
                {customerUsers.map((u) => (
                  <label
                    key={u.customerUserId}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomerUsers.includes(
                        u.customerUserId
                      )}
                      onChange={() =>
                        toggleCustomerUser(u.customerUserId)
                      }
                    />
                    {u.userName} ({u.mobileNumber})
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* REQUESTED CAB */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Requested Cab
            </label>
            <select
              name="requestedCab"
              value={form.requestedCab ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Cab</option>
              {cabs.map((cab) => (
                <option key={cab.cabId} value={cab.cabId}>
                  {cab.cabType}
                </option>
              ))}
            </select>
          </div>

          {/* DESTINATION */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Duty Slip"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
