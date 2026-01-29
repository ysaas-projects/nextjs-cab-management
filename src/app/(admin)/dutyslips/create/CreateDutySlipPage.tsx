"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/atoms/Button";

import { useCreateDutySlipMutation } from "@/features/dutyslip/dutyslipApi";
import { CreateDutySlipRequest } from "@/features/dutyslip";

import { useGetCustomersPaginatedQuery } from "@/features/customer/customerApi";
import { useGetCabsQuery } from "@/features/cab/cabApi";

export default function CreateDutySlipPage() {
  const router = useRouter();

  const [createDutySlip, { isLoading }] =
    useCreateDutySlipMutation();

  // 🔹 Dropdown data
  const { data: customerData } =
    useGetCustomersPaginatedQuery({ pageNumber: 1, pageSize: 100 });

  const { data: cabsData } = useGetCabsQuery();

  const customers = customerData?.items ?? [];
  const cabs = cabsData ?? [];

  // ❌ no bookedBy here
  const [form, setForm] = useState<CreateDutySlipRequest>({
  bookedDate: new Date().toISOString(), // ✅ FIX
  customerId: 0,
  requestedCab: undefined,
  destination: "",
});

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createDutySlip(form).unwrap();
      router.push("/dutyslips");
    } catch (error: any) {
  console.error(
    "Failed to create duty slip",
    error?.data || error
  );
}
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Create Duty Slip" />

      <ComponentCard title="New Duty Slip">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 max-w-lg"
        >
          {/* ================= CUSTOMER DROPDOWN ================= */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Customer
            </label>
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              required
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

          {/* ================= REQUESTED CAB DROPDOWN ================= */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Requested Cab (Optional)
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

          {/* ================= DESTINATION ================= */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Create Duty Slip"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
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
