"use client";

type Props = {
    startKms?: number | null;
    startDateTime?: string | null;
    closeKms?: number | null;
    closeDateTime?: string | null;
    totalKms?: number | null;
    totalTimeInMin?: number | null;
};

const Metric = ({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value?: React.ReactNode;
    highlight?: boolean;
}) => (
    <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">
            {label}
        </p>
        <p
            className={`mt-1 text-sm font-semibold ${highlight
                ? "text-indigo-700"
                : "text-gray-900"
                }`}
        >
            {value ?? "—"}
        </p>
    </div>
);

const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
};

export function formatMinutesToDaysHours(
    totalMinutes: number | null
): string {
    if (!totalMinutes || totalMinutes <= 0) return "—";

    const totalHoursFloat = totalMinutes / 60;
    let totalHours = Math.floor(totalHoursFloat);

    const remainingMinutes =
        totalMinutes - totalHours * 60;

    // ⬆️ Round up if more than 30 minutes
    if (remainingMinutes > 30) {
        totalHours += 1;
    }

    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0 && hours > 0) {
        return `${days} Day${days > 1 ? "s" : ""} ${hours} Hr${hours > 1 ? "s" : ""}`;
    }

    if (days > 0) {
        return `${days} Day${days > 1 ? "s" : ""}`;
    }

    return `${hours} Hr${hours > 1 ? "s" : ""}`;
}


const JourneyInfoCard = ({
    startKms,
    startDateTime,
    closeKms,
    closeDateTime,
    totalKms,
    totalTimeInMin,
}: Props) => {
    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-800">
                    Journey Information
                </h3>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
                <Metric label="Start KMs" value={startKms} />
                <Metric
                    label="Start Time"
                    value={formatDateTime(startDateTime)}
                />

                <Metric label="End KMs" value={closeKms} />
                <Metric
                    label="End Time"
                    value={formatDateTime(closeDateTime)}
                />

                <Metric
                    label="Total KMs"
                    value={totalKms}
                    highlight
                />
                <Metric
                    label="Total Time"
                    value={
                        totalTimeInMin
                            ? `${totalTimeInMin} min`
                            : "—"
                    }
                />
                <Metric
                    label="Total Days, Hrs"
                    value={formatMinutesToDaysHours(totalTimeInMin??0)}
                />


            </div>
        </div>
    );
};

export default JourneyInfoCard;
