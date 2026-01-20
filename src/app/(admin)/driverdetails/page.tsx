"use client";

import { useGetDriverDetailsQuery } from "@/features/driverdetail";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import DriverDetailsTable from "./table";

export default function DriverDetailsPage() {
  const { data, isLoading, isError } = useGetDriverDetailsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading driver details.</div>;

  const tableData =
    data?.map((driver) => ({
      id: driver.driverDetailId,
      driverName: driver.driverName ?? "-",
      mobileNumber: driver.mobileNumber ?? "-",
      status: driver.isActive ? "Active" : "Inactive",
    })) ?? [];

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Driver Details" />

      <div className="space-y-6">
        <ComponentCard
          title="Driver Details List"
          desc={`Total ${tableData.length} drivers found`}
          action={
            <Link href="/driverdetails/create">
              <Button variant="primary" size="sm">
                + Add Driver
              </Button>
            </Link>
          }
        >
          <DriverDetailsTable data={tableData} />
        </ComponentCard>
      </div>
    </>
  );
}
