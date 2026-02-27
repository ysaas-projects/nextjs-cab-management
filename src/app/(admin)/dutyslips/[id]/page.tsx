"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useGetDutySlipDetailsQuery } from "@/features/dutyslip";
import { DutyExpense } from "@/features/dutyExpense";

import DutySlipInfoCard from "./DutySlipInfoCard";
import JourneyInfoCard from "./JourneyInfoCard";
import ExpenseSection from "./ExpenseSection";
import DutyExpenseModal from "../DutyExpenseModal";
import DutySlipTimeline from "../DutySlipTimeline";
import CabPricingSection from "./CabPricingSection";

export default function DutySlipDetailsPage() {
    const params = useParams();
    const dutySlipId = Number(params.id);

    const router = useRouter();
    
    const { data, isLoading, isError } =
        useGetDutySlipDetailsQuery(dutySlipId);

    const [isExpenseOpen, setIsExpenseOpen] =
        useState(false);

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (isError || !data) {
        return (
            <div className="p-6 text-red-600">
                Failed to load duty slip
            </div>
        );
    }

    const { dutySlip, expenses } = data;

    return (
        <>
        <PageBreadcrumb
        backUrl="/dutyslips"
        items={[
            { label: "Duty Slip", href: "/dutyslips" },
            { label: "Duty Slip Details" }
        ]}
        />
            {/* ================= STATUS / TIMELINE ================= */}
            <div className="mb-6">
                <DutySlipTimeline status={dutySlip.status} />
            </div>

            {/* ================= MAIN GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ================= LEFT: INFO ================= */}
                <div className="lg:col-span-8 space-y-6">
                    <DutySlipInfoCard
                        customerName={dutySlip.customerName ?? "—"}
                        driverName={dutySlip.driverName ?? "Not Assigned"}
                        requestedCab={dutySlip.requestedCabType ?? "—"}
                        sentCab={dutySlip.sentCabType ?? "—"}
                        destination={dutySlip.destination ?? "—"}
                        status={dutySlip.status ?? "—"}
                    />

                    <JourneyInfoCard
                        startKms={dutySlip.startKms ?? null}
                        startDateTime={dutySlip.startDateTime ?? null}
                        closeKms={dutySlip.closeKms ?? null}
                        closeDateTime={dutySlip.closeDateTime ?? null}
                        totalKms={dutySlip.totalKms ?? null}
                        totalTimeInMin={dutySlip.totalTimeInMin ?? null}
                    />
                </div>

                {/* ================= RIGHT: EXPENSES ================= */}
                <div className="lg:col-span-4">
                    <ExpenseSection
                        expenses={expenses as DutyExpense[]}
                        onAddExpense={() => setIsExpenseOpen(true)}
                    />
                    <CabPricingSection
                        cabId={dutySlip.sentCab??0}
                        onSave={(selected) => {
                            console.log("Selected pricing rules:", selected);
                        }}
                    />                    
                </div>
            </div>

            {/* ================= ADD EXPENSE MODAL ================= */}
            <DutyExpenseModal
                open={isExpenseOpen}
                dutyId={dutySlip.dutySlipId}
                onClose={() => setIsExpenseOpen(false)}
            />
        </>
    );
}
