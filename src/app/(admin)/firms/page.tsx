"use client";

import { useState } from "react";
import Link from "next/link";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/atoms/Button";

import FirmTable from "./table";
import { FirmWithDetails } from "@/features/firm";
import { useGetFirmsQuery } from "@/features/firm/firmApi";

export default function Firms() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Fetch ALL firms (Firm + FirmDetails from backend)
  const { data, isLoading, isError } = useGetFirmsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading firms.</div>;

  // ✅ Safe fallback
  const allFirms: FirmWithDetails[] = data ?? [];

  // 🔹 Frontend pagination
  const totalCount = allFirms.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFirms = allFirms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Firms" />

      <div className="space-y-6">
        <ComponentCard
          title="Firm List"
          desc={`Total ${totalCount} records found.`}
          action={
            <Link href="/firms/create">
              <Button variant="primary" size="sm">
                + Add Firm
              </Button>
            </Link>
          }
        >
          {/* ✅ Firm Table */}
          <FirmTable data={paginatedFirms} />

          {/* ✅ Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </ComponentCard>
      </div>
    </>
  );
}
