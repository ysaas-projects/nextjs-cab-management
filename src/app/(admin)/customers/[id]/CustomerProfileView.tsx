"use client";
// /customers/[id]/CustomerProfileView.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useGetCustomerByIdQuery } from "@/features/customer";

type Props = {
  customerId: number;
};

export default function CustomerProfileView({ customerId }: Props) {
  const { data, isLoading, isError } =
    useGetCustomerByIdQuery(customerId);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Customer not found.</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Customer Details" />

      <div className="space-y-6">
        <ComponentCard
          title="Customer Information"
          action={
            <Link href="/customers">
              <Button variant="primary" size="sm">
                Back
              </Button>
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* LOGO */}
            <div className="flex items-center justify-center md:col-span-1">
              <CustomerLogo logoPath={data.logoImagePath} />
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2">
              <InfoItem
                label="Customer Name"
                value={data.customerName}
              />
              <InfoItem
                label="Firm Name"
                value={data.firmName ?? "—"}
              />
              <InfoItem
                label="GST Number"
                value={data.gstNumber ?? "—"}
              />
              <InfoItem
                label="Address"
                value={data.address ?? "—"}
              />
              <InfoItem
                label="Status"
                value={<StatusBadge isActive={data.isActive} />}
              />
              <InfoItem
                label="Created At"
                value={formatDate(data.createdAt)}
              />
              <InfoItem
                label="Updated At"
                value={formatDate(data.updatedAt)}
              />
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
const CustomerLogo = ({
  logoPath,
}: {
  logoPath?: string | null;
}) => {
  if (!logoPath) {
    return (
      <div className="flex h-32 w-32 items-center justify-center rounded-full border bg-gray-50 text-sm text-gray-400">
        No Logo
      </div>
    );
  }

  return (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL}/${logoPath}`}
      alt="Customer Logo"
      className="h-32 w-32 rounded-full border object-cover"
    />
  );
};
const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-900">
      {value}
    </p>
  </div>
);

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};
