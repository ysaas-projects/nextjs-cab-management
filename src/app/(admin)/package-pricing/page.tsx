"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import PackagePricingTable from "./table";
import { useGetAllPackagePricingsQuery } from "@/features/packagepricing";

export default function PackagePricingPage() {
  const { data, isLoading, isError } =
    useGetAllPackagePricingsQuery();

  if (isLoading) return <div>Loading package pricing...</div>;
  if (isError) return <div>Failed to load package pricing.</div>;

  const pricingList = data?.data ?? [];

  return (
    <>
      <PageBreadcrumb pageTitle="Package Pricing" />

      <ComponentCard
        title="Package Pricing List"
        desc={`Total ${pricingList.length} records found.`}
        action={
          <Link href="/package-pricing/create">
            <Button variant="primary" size="sm">
              + Add Pricing
            </Button>
          </Link>
        }
      >
        <PackagePricingTable data={pricingList} />
      </ComponentCard>
    </>
  );
}
