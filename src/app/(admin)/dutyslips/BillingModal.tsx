"use client";

import Button from "@/components/atoms/Button";
import CustomSelect from "@/components/atoms/CustomSelect";
import React from "react";

type DutySlipDetails = {
  customerName: string;
  driverName: string;
  requestedCabType?: string;
  sentCabType?: string;
  totalKms?: number;
  totalTimeInMin?: number;
  totalExpenseAmount?: number;
};

type Props = {
  open: boolean;
  loading?: boolean;
  details: DutySlipDetails | null;
  onClose: () => void;
  onSave: (paymentMode: string) => void;
};

const paymentModes = [
  { id: "Cash", name: "Cash" },
  { id: "UPI", name: "UPI" },
  { id: "Card", name: "Card" },
  { id: "BankTransfer", name: "Bank Transfer" },
];
export default function BillingModal({
  open,
  loading,
  details,
  onClose,
  onSave,
}: Props) {
  const [paymentMode, setPaymentMode] = React.useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Billing</h2>

        {/* -------- Duty Slip Details -------- */}
        {details && (
          <div className="text-sm text-gray-700 space-y-1">
            <p><b>Customer:</b> {details.customerName}</p>
            <p><b>Driver:</b> {details.driverName}</p>
            <p><b>Cab:</b> {details.sentCabType ?? "-"}</p>
            <p><b>Total KMs:</b> {details.totalKms ?? "-"}</p>
            <p><b>Total Time:</b> {details.totalTimeInMin ?? "-"} min</p>
            <p className="font-semibold">
              Total Expense: ₹{details.totalExpenseAmount ?? 0}
            </p>
          </div>
        )}
<CustomSelect
  label="Payment Mode"
  name="paymentMode"                 // ✅ REQUIRED
  value={paymentMode}
  options={paymentModes}
  onChange={(e) => setPaymentMode(e.target.value)}
/>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!paymentMode || loading}
            onClick={() => onSave(paymentMode)}
          >
            Save Billing
          </Button>
        </div>
      </div>
    </div>
  );
}
