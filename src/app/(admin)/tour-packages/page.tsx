// src/app/(admin)/tour-packages/page.tsx
"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import TourPackageTable from "./table";
import { useGetTourPackagesQuery } from "@/features/tourpackage";

export default function TourPackagesPage() {
  // 🔥 THIS LINE TRIGGERS THE API CALL
  const { data, isLoading, isError } = useGetTourPackagesQuery();

  if (isLoading) return <div>Loading tour packages...</div>;
  if (isError) return <div>Failed to load tour packages.</div>;

  // ✅ Always normalize data
  const packages = data?.data ?? [];

  // ✅ Transform backend → table format
  const transformedData = packages.map((pkg: any) => ({
  id: pkg.packageId,        // ✅ MUST be packageId
    name: pkg.packageName,
    basePrice: pkg.basePrice,
    minPersons: pkg.minPersons,
    isActive: pkg.isActive,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Tour Packages" />

      <ComponentCard
        title="Tour Package List"
        desc={`Total ${transformedData.length} records found.`}
        action={
          <Link href="/tour-packages/create">
            <Button variant="primary" size="sm">
              + Add Tour Package
            </Button>
          </Link>
        }
      >
        <TourPackageTable data={transformedData} />
      </ComponentCard>
    </>
  );
}
