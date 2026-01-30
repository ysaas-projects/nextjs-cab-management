"use client";

import DutySlipTimeline from "../DutySlipTimeline";

type Props = {
    customerName: string;
    driverName?: string | null;
    requestedCab?: string | null;
    sentCab?: string | null;
    destination?: string | null;
    status: string;
};

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value?: React.ReactNode;
}) => (
    <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">
            {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
            {value ?? "—"}
        </p>
    </div>
);

const statusColorMap: Record<string, string> = {
    Booked: "text-blue-700",
    "Driver-Assigned": "text-yellow-700",
    "Start-Journey": "text-green-700",
    "End-Journey": "text-purple-700",
    "Bill-Pending": "text-red-700",
};

const DutySlipInfoCard = ({
    customerName,
    driverName,
    requestedCab,
    sentCab,
    destination,
    status,
}: Props) => {
    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <div className="px-6 py-4  border-b bg-gray-300">
                <h3 className="font-semibold text-gray-800">
                    Duty Slip Information
                </h3>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6 bg-gray-100">

                <InfoItem label="Customer" value={customerName} />
                <InfoItem label="Driver" value={driverName || "Not Assigned"} />

                <InfoItem
                    label="Requested Cab"
                    value={requestedCab}
                />
                <InfoItem label="Sent Cab" value={sentCab} />

                <InfoItem
                    label="Destination"
                    value={destination}
                />

                <InfoItem
                    label="Status"
                    value={
                        <span
                            className={`inline-flex items-center gap-2 font-bold ${statusColorMap[status] ?? "text-gray-700"
                                }`}
                        >
                            <span className="text-lg">●</span>
                            {status}
                        </span>
                    }
                />

            </div>
        </div>
    );
};

export default DutySlipInfoCard;
