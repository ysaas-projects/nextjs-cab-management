"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetFirmByIdQuery } from "@/features/firm/firmApi";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";

/* =======================
   MAIN PAGE
======================= */

export default function FirmProfileView() {
  const { id } = useParams<{ id: string }>();
  const firmId = Number(id);
  const router = useRouter();

  const { data, isLoading, isError } = useGetFirmByIdQuery(firmId);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError || !data)
    return <p className="p-6 text-red-500">Failed to load firm</p>;

  const firm = data;
  const details = firm.firmDetails;

  return (
    <div className="flex gap-6 bg-slate-50 p-6 min-h-screen">

      {/* ================= LEFT PANEL ================= */}
      <div className="w-64 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
        <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-xl text-xl font-bold">
          {firm.firmName?.[0]}
        </div>

        <p className="mt-4 font-semibold text-lg text-center">
          {firm.firmName}
        </p>

        <span
          className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            firm.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {firm.isActive ? "Active" : "Inactive"}
        </span>

        {/* Edit Firm */}
        <Button
          size="sm"
          className="mt-4"
          onClick={() => router.push(`/firms/edit/${firm.firmId}`)}
          startIcon={<Icon name="PencilIcon" className="w-4 h-4" />}
        >
          Edit Firm
        </Button>
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="flex-1 space-y-6">

        {/* -------- Firm Information -------- */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <Icon name="BoxIcon" className="w-5 h-5" />
            Firm Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info label="Firm Name" value={firm.firmName} />
            <Info label="Firm Code" value={firm.firmCode} />
            <Info
              label="Status"
              value={firm.isActive ? "Active" : "Inactive"}
            />
          </div>
        </div>

        {/* -------- Contact Details -------- */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <Icon name="UserIcon" className="w-5 h-5" />
              Contact Details
            </h2>

            {/* ✅ Edit FirmDetails */}
            {details?.firmDetailsId && (
              <Button
                size="xs"
                variant="default"
                startIcon={<Icon name="PencilIcon" className="w-4 h-4" />}
                onClick={() =>
                  router.push(
                    `/firms/details/edit/${details.firmDetailsId}`
                  )
                }
              >
                Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info
              label="Contact Person"
              value={details?.contactPerson}
            />
            <Info
              label="Contact Number"
              value={details?.contactNumber}
            />
            <Info
              label="GST Number"
              value={details?.gstNumber}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* =======================
   SMALL INFO CARD
======================= */

const Info = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value || "-"}</p>
  </div>
);