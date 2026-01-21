"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetFirmTermByIdQuery } from "@/features/firmTerm/firmTermApi";
import Link from "next/link";
import Button from "@/components/atoms/Button";

export default function FirmTermDetailsPage() {
  const params = useParams();
  const id = Number(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const { data, isLoading, isError } = useGetFirmTermByIdQuery(id, {
    skip: !id || Number.isNaN(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Firm term not found.</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Firm Term #{data.firmTermId}
          </h1>
          <p className="text-sm text-gray-500">
            Firm Id: {data.firmId}
          </p>
        </div>

        {/* ✅ Back button (same as other pages) */}
        <Link href="/firm-terms">
          <Button variant="primary" size="sm">
            Back
          </Button>
        </Link>
      </div>

      {/* ===== DETAILS CARD ===== */}
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Description
          </h2>
          <p className="text-gray-800 whitespace-pre-line">
            {data.description}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Status
          </h2>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              data.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {data.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
