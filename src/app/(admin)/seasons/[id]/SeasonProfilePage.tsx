"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import { useGetSeasonByIdQuery } from "@/features/season/seasonApi";

type Props = {
  seasonId: number;
};

export default function SeasonProfileView({ seasonId }: Props) {
  const { data, isLoading, isError } =
    useGetSeasonByIdQuery(seasonId);

  if (isLoading) return <div>Loading season...</div>;
  if (isError || !data?.data)
    return <div>Season not found.</div>;

  const season = data.data;

  return (
    <>
      <PageBreadcrumb pageTitle="Season Details" />

      <div className="space-y-6">
        <ComponentCard
          title="Season Information"
          action={
            <div className="flex gap-2">
              <Link href={`/seasons/edit/${season.seasonId}`}>
                <Button variant="primary" size="sm">
                  Edit
                </Button>
              </Link>

              <Link href="/seasons">
                <Button variant="default" size="sm">
                  Back
                </Button>
              </Link>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoItem
              label="Season Name"
              value={season.seasonName ?? "—"}
            />

            <InfoItem
              label="Start Date"
              value={formatDate(season.startDate)}
            />

            <InfoItem
              label="End Date"
              value={formatDate(season.endDate)}
            />

            <InfoItem
              label="Status"
              value={<StatusBadge isActive={season.isActive} />}
            />

            <InfoItem
              label="Created At"
              value={formatDate(season.createdAt)}
            />

            <InfoItem
              label="Updated At"
              value={formatDate(season.updatedAt)}
            />
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

/* ================= HELPERS ================= */

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
  return new Date(date).toLocaleDateString();
};
