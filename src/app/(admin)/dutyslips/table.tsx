"use client";

import Button from "@/components/atoms/Button";

type Props = {
  data: {
    id: number;
    customerName: string;
    driverName: string;
    requestedCab: string;
    sentCab: string;
    destination: string;
    status: string;
  }[];

  // 🔥 NEW: parent कडून येणारा callback
  onAssignDriver: (dutySlipId: number) => void;
};

const DutySlipTable = ({ data, onAssignDriver }: Props) => {
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
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`border-t ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <td className="px-6 py-4">{index + 1}</td>

              <td className="px-6 py-4 font-medium">
                {item.customerName}
              </td>

              <td className="px-6 py-4">
                {item.driverName || "Not Assigned"}
              </td>

              <td className="px-6 py-4">{item.requestedCab}</td>

              <td className="px-6 py-4">{item.sentCab || "—"}</td>

              <td className="px-6 py-4">{item.destination}</td>

              <td className="px-6 py-4">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {item.status}
                </span>
              </td>

              {/* ✅ ACTION COLUMN */}
              <td className="px-6 py-4 text-center">
                <Button
                  size="xs"
                  variant="primary"
                  disabled={item.status !== "Booked"}
                  onClick={() => onAssignDriver(item.id)}
                >
                  Assign Driver
                </Button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
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
