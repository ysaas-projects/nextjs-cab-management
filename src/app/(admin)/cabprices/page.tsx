"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import CabPriceTable from "./table";

import { useGetCabPricesQuery } from "@/features/cabprice";

export default function CabPrices() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ IMPORTANT: default empty array
  const {
    data: allPrices = [],
    isLoading,
    isError,
  } = useGetCabPricesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cab prices.</div>;

  const totalCount = allPrices.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const paginatedPrices = allPrices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Transform API data for table
  const transformedData = paginatedPrices.map((p) => ({
    cabPriceId: p.cabPriceId,
    firmName: p.firmName,
    cabType: p.cabType,
    pricingRuleId: p.pricingRuleId,
    price: p.price,
    isActive: p.isActive,
    createdAt: p.createdAt,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Cab Prices" />

      <div className="space-y-6">
        <ComponentCard
          title="Cab Price List"
          desc={`Total ${totalCount} records found.`}
          action={
            <Link href="/cabprices/create">
              <Button variant="primary" size="sm">
                + Add Cab Price
              </Button>
            </Link>
          }
        >
          {/* ✅ PASS data prop */}
          <CabPriceTable data={transformedData} />

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
