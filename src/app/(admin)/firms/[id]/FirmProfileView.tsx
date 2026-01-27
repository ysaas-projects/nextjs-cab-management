"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";

import { useGetFirmByIdQuery } from "@/features/firm/firmApi";

export default function FirmDetailsPage() {
  const params = useParams();
  const id = Number(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const { data, isLoading, isError } = useGetFirmByIdQuery(id, {
    skip: !id || Number.isNaN(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Firm not found.</div>;

  const firm = data;
  const details = firm.firmDetails;

  return (
    <>
      <PageBreadcrumb pageTitle="Firm Details" />

      <ComponentCard
        title="Firm Information"
        action={
          <Link href="/firms">
            <Button variant="primary" size="sm">
              Back
            </Button>
          </Link>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Firm Name" value={firm.firmName} />
          <Info label="Firm Code" value={firm.firmCode} />
          <Info
            label="Status"
            value={firm.isActive ? "Active" : "Inactive"}
          />
          {/* <Info
            label="Created At"
            value={formatDate(firm.createdAt)}
          />
          <Info
            label="Updated At"
            value={formatDate(firm.updatedAt)}
          /> */}
        </div>
      </ComponentCard>

      {details && (
        <ComponentCard title="Contact Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info
              label="Contact Person"
              value={details.contactPerson}
            />
            <Info
              label="Contact Number"
              value={details.contactNumber}
            />
            <Info
              label="GST Number"
              value={details.gstNumber}
            />
          </div>
        </ComponentCard>
      )}
    </>
  );
}

/* ================= HELPERS ================= */

const Info = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-900">
      {value || "—"}
    </p>
  </div>
);

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};
