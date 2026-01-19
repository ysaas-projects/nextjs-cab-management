"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";

import FirmTermTable from "./table";
import { useGetFirmTermsQuery } from "@/features/firmTerms";

export default function FirmTerms() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ API call
  const { data, isLoading, isError } = useGetFirmTermsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading firm terms.</div>;

  // ✅ Safe fallback
  const firmTerms = data ?? [];

  // Pagination logic
  const totalPages = Math.ceil(firmTerms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = firmTerms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Transform data ONLY for table
  const transformedData = paginatedData.map((term: { firmTermId: any; firmId: any; description: any; isActive: any; }) => ({
    id: term.firmTermId,
    firmId: term.firmId,
    description: term.description,
    isActive: term.isActive,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Firm Terms" />

      <div className="space-y-6">
        <ComponentCard
          title="Firm Term List"
          desc={`Total ${firmTerms.length} records found.`}
          action={
            <Link href="/firmTerm/create">
              <Button variant="primary" size="sm">
                + Add Firm Term
              </Button>
            </Link>
          }
        >
          {/* ✅ TABLE (THIS WAS MISSING BEFORE) */}
          <FirmTermTable data={transformedData} />

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
