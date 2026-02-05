"use client";
// src/app/(admin)/cabprices/page.tsx

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CabPriceMatrixTable from "./matrix-table";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import { useGetCabPricingMatrixQuery } from "@/features/cabprice";

export default function CabPrices() {
  const { data = [], isLoading, isError } =
    useGetCabPricingMatrixQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cab pricing matrix</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Cab Prices" />

      <ComponentCard
        title="Cab Pricing Matrix"
        desc="Cab × Pricing Rule price configuration"
        action={
          <Link href="/cabprices/create">
            <Button size="sm">+ Add Price</Button>
          </Link>
        }
      >
        <CabPriceMatrixTable data={data} />
      </ComponentCard>
    </>
  );
}
