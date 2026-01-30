"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";

import { useGetCabsQuery } from "@/features/cab/cabApi";
import { useAssignDriverMutation } from "@/features/dutyslip/dutyslipApi";
import { useGetDriverDetailsQuery } from "@/features/driverdetail/driverdetailApi";
import { useGetCabWiseCabNumbersQuery } from "@/features/cabnumberdirectory/cabnumberdirectoryApi";

type Props = {
  open: boolean;
  onClose: () => void;
  dutySlipId: number | null;
};

const AssignDriverModal = ({ open, onClose, dutySlipId }: Props) => {
  const { data: drivers = [] } = useGetDriverDetailsQuery();
  const { data: cabs = [] } = useGetCabsQuery();
const { data: cabWise } = useGetCabWiseCabNumbersQuery();

  const [assignDriver, { isLoading }] = useAssignDriverMutation();

  const [driverId, setDriverId] = useState<number | null>(null);
  const [sentCab, setSentCab] = useState<number | null>(null);
  const [cabNumber, setCabNumber] = useState<string>("");
 const [reportingAddress, setReportingAddress] = useState("");
const [reportingDateTime, setReportingDateTime] = useState("");
  if (!open) return null;

  // 🔥 Selected cab अनुसार cab numbers काढ
  const cabNumbers =
    cabWise?.data?.find((c: any) => c.cabId === sentCab)
      ?.cabNumbers ?? [];

  const handleAssign = async () => {
    if (!driverId || !sentCab || !cabNumber) {
      enqueueSnackbar("Please select all fields", {
        variant: "warning",
      });
      return;
    }

    try {
     await assignDriver({
  dutySlipId: dutySlipId!,
  driverDetailId: driverId,
  sentCab,
  cabNumber,
  reportingAddress,                    // ✅ REQUIRED
  reportingDateTime: reportingDateTime || undefined,
}).unwrap();

      onClose();
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to assign driver",
        { variant: "error" }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded bg-white p-4 space-y-3">
        <h2 className="text-lg font-semibold">
          Assign Driver
        </h2>

        {/* DRIVER */}
        <select
          className="w-full border rounded px-3 py-2"
          value={driverId ?? ""}
          onChange={(e) =>
            setDriverId(Number(e.target.value))
          }
        >
          <option value="">Select Driver</option>
          {drivers.map((d: any) => (
            <option
              key={d.driverDetailId}
              value={d.driverDetailId}
            >
              {d.driverName}
            </option>
          ))}
        </select>

        {/* CAB */}
        <select
          className="w-full border rounded px-3 py-2"
          value={sentCab ?? ""}
          onChange={(e) => {
            setSentCab(Number(e.target.value));
            setCabNumber("");
          }}
        >
          <option value="">Select Cab</option>
          {cabs.map((c: any) => (
            <option key={c.cabId} value={c.cabId}>
              {c.cabType}
            </option>
          ))}
        </select>

        {/* CAB NUMBER */}
        <select
          className="w-full border rounded px-3 py-2"
          value={cabNumber}
          disabled={!sentCab}
          onChange={(e) => setCabNumber(e.target.value)}
        >
          <option value="">Select Cab Number</option>
          {cabNumbers.map((n: any) => (
            <option
              key={n.cabNumberDirectoryId}
              value={n.cabNumber}
            >
              {n.cabNumber}
            </option>

            
          ))}
        </select>

        <input
  type="text"
  placeholder="Reporting Address"
  className="w-full border rounded px-3 py-2"
  value={reportingAddress}
  onChange={(e) => setReportingAddress(e.target.value)}
/>

<input
  type="datetime-local"
  className="w-full border rounded px-3 py-2"
  value={reportingDateTime}
  onChange={(e) => setReportingDateTime(e.target.value)}
/>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleAssign}
            disabled={isLoading}
          >
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignDriverModal;
