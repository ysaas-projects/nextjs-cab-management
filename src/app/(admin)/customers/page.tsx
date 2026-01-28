// src/app/(admin)/customers/page.tsx
"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import CustomerTable from "./table";

import { useGetCustomersPaginatedQuery } from "@/features/customer/customerApi";
import { Customer } from "@/features/customer";

export default function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading, isError } =
    useGetCustomersPaginatedQuery(
      {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading customers.</div>;

  // ✅ backend-driven pagination (EXACTLY LIKE CABS)
  const customers: Customer[] = data?.items ?? [];
const totalPages = data?.totalPages ?? 1;
const totalCount = data?.totalCount ?? 0;

  // ✅ transform data for table (same pattern)
  const transformedData = customers.map((customer) => ({
    id: customer.customerId,
    customerName: customer.customerName,
    firmName: customer.firmName ?? "—",
    gstNumber: customer.gstNumber ?? "—",
    isActive: customer.isActive,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Customers" />

      <div className="space-y-6">
        <ComponentCard
          title="Customer List"
          desc={`Total ${totalCount} records found.`}
          action={
            <Link href="/customers/create">
              <Button variant="primary" size="sm">
                + Add Customer
              </Button>
            </Link>
          }
        >
          <CustomerTable data={transformedData} />

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
