"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useGetDutySlipDetailsQuery } from "@/features/dutyslip";
import { DutyExpense } from "@/features/dutyExpense";

import DutySlipInfoCard from "./DutySlipInfoCard";
import JourneyInfoCard from "./JourneyInfoCard";
import ExpenseSection from "./ExpenseSection";
import DutyExpenseModal from "../DutyExpenseModal";
import DutySlipTimeline from "../DutySlipTimeline";
import CabPricingSection from "./CabPricingSection";

import {
  useCreateInvoiceItemMutation,
  useGetInvoiceItemsByInvoiceIdQuery
} from "@/features/invoiceitem/invoiceItemApi";

export default function DutySlipDetailsPage() {

  const params = useParams();
  const dutySlipId = Number(params.id);

  const { data, isLoading, isError } =
    useGetDutySlipDetailsQuery(dutySlipId);

  const { data: invoiceItems = [] } =
    useGetInvoiceItemsByInvoiceIdQuery(dutySlipId);

  const [createInvoiceItem] =
    useCreateInvoiceItemMutation();

  const [isExpenseOpen, setIsExpenseOpen] =
    useState(false);

  const [billAmount, setBillAmount] =
    useState<number>(0);

  const dutySlip = data?.dutySlip;
  const expenses = data?.expenses ?? [];

  /* ================= EXPENSE TOTAL ================= */

  const expenseTotal = expenses.reduce(
    (sum: number, e: any) => sum + (e.amount ?? 0),
    0
  );

  /* ================= LOAD TOTAL FROM DB + EXPENSE ================= */

  useEffect(() => {

    const cabTotal = invoiceItems.reduce(
      (sum: number, item: any) => sum + (item.totalPrice ?? 0),
      0
    );

    setBillAmount(cabTotal + expenseTotal);

  }, [invoiceItems, expenseTotal]);

  /* ================= BILL CALCULATION ================= */

  const calculateBill = (rules: any[]) => {

    const totalKms = dutySlip?.totalKms ?? 0;
    const totalHours = (dutySlip?.totalTimeInMin ?? 0) / 60;

    let total = 0;

    let baseKm = 40;
    let baseHours = 4;

    const has80 = rules.some(r =>
      r.rule.toLowerCase().includes("80km")
    );

    const hasOutstation = rules.some(r =>
      r.rule.toLowerCase().includes("outstation")
    );

    if (has80) {
      baseKm = 80;
      baseHours = 8;
    }

    if (hasOutstation) {
      baseKm = 300;
      baseHours = 24;
    }

    rules.forEach(rule => {

      const name = rule.rule.toLowerCase();

      if (
        name.includes("40km") ||
        name.includes("80km") ||
        name.includes("outstation") ||
        name.includes("driver") ||
        name.includes("toll")
      ) {
        total += rule.amount;
      }

      if (name.includes("extra kms")) {

        const extraKm = Math.max(totalKms - baseKm, 0);

        total += extraKm * rule.amount;
      }

      if (name.includes("extra hrs")) {

        const extraHrs = Math.max(totalHours - baseHours, 0);

        total += extraHrs * rule.amount;
      }

    });

    return total;
  };

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

  /* ================= SAVED RULES ================= */

  const savedRuleNames = invoiceItems.map(
    (x: any) => x.particulars
  );

  return (
    <>
      <PageBreadcrumb
        backUrl="/dutyslips"
        items={[
          { label: "Duty Slip", href: "/dutyslips" },
          { label: "Duty Slip Details" }
        ]}
      />

      <div className="mb-6">
        <DutySlipTimeline status={dutySlip?.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT SECTION */}

        <div className="lg:col-span-8 space-y-6">

          <DutySlipInfoCard
            customerName={dutySlip?.customerName ?? "—"}
            driverName={dutySlip?.driverName ?? "Not Assigned"}
            requestedCab={dutySlip?.requestedCabType ?? "—"}
            sentCab={dutySlip?.sentCabType ?? "—"}
            destination={dutySlip?.destination ?? "—"}
            status={dutySlip?.status ?? "—"}
          />

          <JourneyInfoCard
            startKms={dutySlip?.startKms ?? null}
            startDateTime={dutySlip?.startDateTime ?? null}
            closeKms={dutySlip?.closeKms ?? null}
            closeDateTime={dutySlip?.closeDateTime ?? null}
            totalKms={dutySlip?.totalKms ?? null}
            totalTimeInMin={dutySlip?.totalTimeInMin ?? null}
          />

        </div>

        {/* RIGHT SECTION */}

        <div className="lg:col-span-4">

          <ExpenseSection
            expenses={expenses as DutyExpense[]}
            onAddExpense={() => setIsExpenseOpen(true)}
          />

          <CabPricingSection
            cabId={dutySlip?.sentCab ?? 0}
            totalAmount={billAmount}
            dutyExpenseAmount={expenseTotal}
            totalKms={dutySlip?.totalKms ?? 0}
            totalTimeInMin={dutySlip?.totalTimeInMin ?? 0}
            savedRules={savedRuleNames}

            onChange={(selected) => {

              const total =
                calculateBill(selected) + expenseTotal;

              setBillAmount(total);

            }}

            onSave={async (selected) => {

              const total =
                calculateBill(selected) + expenseTotal;

              setBillAmount(total);

              const totalKms = dutySlip?.totalKms ?? 0;
              const totalHours =
                (dutySlip?.totalTimeInMin ?? 0) / 60;

              let baseKm = 40;
              let baseHours = 4;

              if (selected.some(r =>
                r.rule.toLowerCase().includes("80km"))) {
                baseKm = 80;
                baseHours = 8;
              }

              if (selected.some(r =>
                r.rule.toLowerCase().includes("outstation"))) {
                baseKm = 300;
                baseHours = 24;
              }

          for (const rule of selected) {

  let quantity = 1;
  let price = rule.amount;
  let totalPrice = price;

  if (rule.rule.toLowerCase().includes("extra kms")) {

    const extraKm = Math.max(totalKms - baseKm, 0);

    quantity = extraKm;
    totalPrice = extraKm * price;

  }

  if (rule.rule.toLowerCase().includes("extra hrs")) {

  const extraHrs = Math.max(totalHours - baseHours, 0);

  quantity = Number(extraHrs.toFixed(2)); // 👈 save 0.5
  totalPrice = quantity * price;

}

  if (totalPrice <= 0) continue;

  await createInvoiceItem({
    firmId: dutySlip?.firmId ?? 0,
    invoiceId: dutySlip?.dutySlipId ?? 0,
    particulars: rule.rule,
    quantity: quantity,
    price: price,
    totalPrice: totalPrice
  });

}

            }}

          />

        </div>

      </div>

      <DutyExpenseModal
        open={isExpenseOpen}
        dutyId={dutySlip?.dutySlipId ?? 0}
        onClose={() => setIsExpenseOpen(false)}
      />
    </>
  );
}