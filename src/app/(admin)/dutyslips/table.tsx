"use client";

import Button from "@/components/atoms/Button";
import DutySlipTimeline from "./DutySlipTimeline";


type DutySlipRow = {
  id: number;
  customerName: string;
  driverName: string;
  requestedCab: string;
  sentCab: string;
  destination: string;
  status: string;
};

type Props = {
  data: DutySlipRow[];

  onAssignDriver: (id: number) => void;
  onStartJourney: (id: number) => void;
  onEndJourney: (id: number) => void;
  onBilling: (id: number) => void;

  isActionDisabled?: boolean;
};

/**
 * Status → Allowed Actions
 * Backend-aligned
 */
const actionByStatus: Record<
  string,
  {
    assign?: boolean;
    start?: boolean;
    end?: boolean;
    billing?: boolean;
  }
> = {
  "Booked": { assign: true },
  "Driver-Assigned": { start: true },
  "Start-Journey": { end: true },
  "End-Journey": { billing: true },
};

const statusColorMap: Record<string, string> = {
  "Booked": "bg-blue-100 text-blue-700",
  "Driver-Assigned": "bg-yellow-100 text-yellow-700",
  "Start-Journey": "bg-green-100 text-green-700",
  "End-Journey": "bg-purple-100 text-purple-700",
  "Bill-Pending": "bg-red-100 text-red-700",
};

const DutySlipTable = ({
  data,
  onAssignDriver,
  onStartJourney,
  onEndJourney,
  onBilling,
  isActionDisabled
}: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Driver</th>
            <th className="px-6 py-3">Requested Cab</th>
            <th className="px-6 py-3">Sent Cab</th>
            <th className="px-6 py-3">Destination</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            const actions = actionByStatus[item.status] || {};

            return (
              <tr
                key={item.id}
                className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
              >
                <td className="px-6 py-4">{index + 1}</td>

                <td className="px-6 py-4 font-medium">
                  {item.customerName}
                </td>

                <td className="px-6 py-4">
                  {item.driverName || "Not Assigned"}
                </td>

                <td className="px-6 py-4">
                  {item.requestedCab || "—"}
                </td>

                <td className="px-6 py-4">
                  {item.sentCab || "—"}
                </td>

                <td className="px-6 py-4">
                  {item.destination || "—"}
                </td>
                {/* <td className="px-6 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${statusColorMap[item.status] ??
                      "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td> */}

                <td className="px-6 py-4">
                  <DutySlipTimeline status={item.status} />
                </td>

                {/* ================= ACTION COLUMN ================= */}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {actions.assign && (
                      <Button
                        size="xs"
                        variant="primary"
                        disabled={isActionDisabled}
                        onClick={() => onAssignDriver(item.id)}
                      >
                        Assign
                      </Button>
                    )}

                    {actions.start && (
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() =>
                          onStartJourney(item.id)
                        }
                      >
                        Start
                      </Button>
                    )}

                    {actions.end && (
                      <Button
                        size="xs"
                        variant="danger"
                        onClick={() =>
                          onEndJourney(item.id)
                        }
                      >
                        End
                      </Button>
                    )}

                    {actions.billing && (
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() =>
                          onBilling(item.id)
                        }
                      >
                        Billing
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-6 text-center text-gray-500"
              >
                No duty slips found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DutySlipTable;
