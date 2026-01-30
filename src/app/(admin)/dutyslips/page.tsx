"use client";

import { useState } from "react";
import Link from "next/link";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/atoms/Button";

import DutySlipTable from "./table";

import { useGetDutySlipsQuery } from "@/features/dutyslip/dutyslipApi";
import { DutySlip } from "@/features/dutyslip";
import AssignDriverModal from "./AssignDriverModal";

export default function DutySlipsPage() {
  // ===============================
  // API
  // ===============================
  const { data, isLoading, isError } = useGetDutySlipsQuery();

  // ===============================
  // STATE (Assign Driver Modal)
  // ===============================
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedDutySlipId, setSelectedDutySlipId] =
    useState<number | null>(null);

  const handleAssignDriver = (id: number) => {
    setSelectedDutySlipId(id);
    setIsAssignOpen(true);
  };

  // ===============================
  // LOADING / ERROR
  // ===============================
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading duty slips.</div>;

  // ===============================
  // DATA TRANSFORM
  // ===============================
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

  // ===============================
  // RENDER
  // ===============================
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
        <DutySlipTable
          data={transformedData}
          onAssignDriver={handleAssignDriver}
        />
      </ComponentCard>

      {/* ===============================
          ASSIGN DRIVER MODAL
         =============================== */}
      <AssignDriverModal
        open={isAssignOpen}
        dutySlipId={selectedDutySlipId}
        onClose={() => setIsAssignOpen(false)}
      />
    </>
  );
}
