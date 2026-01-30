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
import StartJourneyModal from "./StartJourneyModal";
import EndJourneyModal from "./EndJourneyModal";

type TableRow = {
  id: number;
  customerName: string;
  driverName: string;
  requestedCab: string;
  sentCab: string;
  destination: string;
  status: string;

  // ✅ Needed for End Journey auto-calculation
  startKms: number | null;
  startDateTime: string | null;
};

export default function DutySlipsPage() {
  // ===============================
  // API
  // ===============================
  const { data, isLoading, isError } =
    useGetDutySlipsQuery();

  // ===============================
  // STATE
  // ===============================
  const [selectedSlip, setSelectedSlip] =
    useState<TableRow | null>(null);

  const [isAssignOpen, setIsAssignOpen] =
    useState(false);
  const [isStartOpen, setIsStartOpen] =
    useState(false);
  const [isEndOpen, setIsEndOpen] =
    useState(false);

  const isAnyModalOpen =
    isAssignOpen || isStartOpen || isEndOpen;

  // ===============================
  // HANDLERS
  // ===============================
  const handleAssignDriver = (slip: TableRow) => {
    setSelectedSlip(slip);
    setIsAssignOpen(true);
  };

  const handleStartJourney = (slip: TableRow) => {
    setSelectedSlip(slip);
    setIsStartOpen(true);
  };

  const handleEndJourney = (slip: TableRow) => {
    setSelectedSlip(slip);
    setIsEndOpen(true);
  };

  const handleBilling = (slip: TableRow) => {
    console.log("Billing for DutySlip:", slip.id);
    // future: open billing modal or navigate
  };

  // ===============================
  // LOADING / ERROR
  // ===============================
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error loading duty slips.</div>;

  // ===============================
  // DATA TRANSFORM
  // ===============================
  const dutySlips: DutySlip[] = data ?? [];

  const transformedData: TableRow[] =
    dutySlips.map((slip) => ({
      id: slip.dutySlipId,
      customerName: slip.customerName ?? "—",
      driverName: slip.driverName ?? "Not Assigned",
      requestedCab: slip.requestedCabType ?? "—",
      sentCab: slip.sentCabType ?? "—",
      destination: slip.destination ?? "—",
      status: slip.status ?? "—",

      // ✅ Needed for auto calculation
      startKms: slip.startKms ?? null,
      startDateTime: slip.startDateTime ?? null,
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
          onAssignDriver={(id) =>
            handleAssignDriver(
              transformedData.find(
                (x) => x.id === id
              )!
            )
          }
          onStartJourney={(id) =>
            handleStartJourney(
              transformedData.find(
                (x) => x.id === id
              )!
            )
          }
          onEndJourney={(id) =>
            handleEndJourney(
              transformedData.find(
                (x) => x.id === id
              )!
            )
          }
          onBilling={(id) =>
            handleBilling(
              transformedData.find(
                (x) => x.id === id
              )!
            )
          }

          isActionDisabled={isAnyModalOpen}          
        />
      </ComponentCard>

      {/* ===============================
          MODALS
         =============================== */}

      <AssignDriverModal
        open={isAssignOpen}
        dutySlipId={selectedSlip?.id ?? null}
        onClose={() => setIsAssignOpen(false)}
      />

      <StartJourneyModal
        open={isStartOpen}
        dutySlipId={selectedSlip?.id ?? null}
        onClose={() => setIsStartOpen(false)}
      />

      <EndJourneyModal
        open={isEndOpen}
        dutySlipId={selectedSlip?.id ?? null}
        startKms={selectedSlip?.startKms ?? null}
        startDateTime={
          selectedSlip?.startDateTime ?? null
        }
        onClose={() => setIsEndOpen(false)}
      />
    </>
  );
}
