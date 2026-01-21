"use client";

// /driverdetails/[id]/DriverProfileView.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import { useParams } from "next/navigation";
import { useGetDriverDetailByIdQuery } from "@/features/driverdetail";

export default function DriverProfileView() {
  const params = useParams();
  const driverDetailId = Number(params.id);

  const { data, isLoading, isError } =
    useGetDriverDetailByIdQuery(driverDetailId, {
      skip: !driverDetailId,
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Driver not found.</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Driver Details" />

      <div className="space-y-6">
        <ComponentCard
          title="Driver Information"
          action={
            <Link href="/driverdetails">
              <Button variant="primary" size="sm">
                Back
              </Button>
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoItem
              label="Driver Name"
              value={data.driverName ?? "—"}
            />

            <InfoItem
              label="Mobile Number"
              value={data.mobileNumber ?? "—"}
            />

            {/* Optional: Firm Name (only if API provides it later) */}
            {/* <InfoItem
              label="Firm Name"
              value={data.firmName ?? "—"}
            /> */}

            <InfoItem
              label="Status"
              value={
                <StatusBadge isActive={!!data.isActive} />
              }
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
        </ComponentCard>
      </div>
    </>
  );
}

/* ---------------- Helpers (same as Cab) ---------------- */

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

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};
