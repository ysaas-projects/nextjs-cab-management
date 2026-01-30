"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DutySlipTable from "./table";
import Link from "next/link";
import Button from "@/components/atoms/Button";

import { useGetDutySlipsQuery } from "@/features/dutyslip/dutyslipApi";
import { DutySlip } from "@/features/dutyslip";

export default function DutySlipsPage() {
  const { data, isLoading, isError } = useGetDutySlipsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading duty slips.</div>;

  // ✅ FIX HERE
  const dutySlips: DutySlip[] = data ?? [];

  const transformedData = dutySlips.map((slip) => ({
    id: slip.dutySlipId,
    customerName: slip.customerName ?? "—",
    driverName: slip.driverName ?? "Not Assigned",
    requestedCab: slip.requestedCabType ?? "—",
    sentCab: slip.sentCabType ?? "—",
    destination: slip.destination ?? "—",
    status: slip.status ?? "—",
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Duty Slips" />

      <ComponentCard
        title="Duty Slip List"
        desc={`Total ${transformedData.length} records found.`}
        action={
          <Link href="/dutyslips/create">
            <Button variant="primary" size="sm">
              + Add Duty Slip
            </Button>
          </Link>
        }
      >
        <DutySlipTable data={transformedData} />
      </ComponentCard>
    </>
  );
}
