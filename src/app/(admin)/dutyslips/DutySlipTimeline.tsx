type Props = {
    status?: string | null;
};

const steps = [
    { key: "Booked", label: "Booked" },
    { key: "Driver-Assigned", label: "Assigned" },
    { key: "Start-Journey", label: "Started" },
    { key: "End-Journey", label: "Completed" },
    { key: "Bill-Pending", label: "Billing" },
];

const getStepIndex = (key: string) =>
    steps.findIndex((s) => s.key === key);

const DutySlipTimeline = ({ status }: Props) => {
    const currentIndex = status
        ? getStepIndex(status)
        : -1;

    return (
        <div className="flex flex-col gap-2 text-xs">
            {steps.map((step, idx) => {
                const isDone = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                    <div
                        key={step.key}
                        className="flex items-start gap-2"
                    >
                        {/* LEFT INDICATOR */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${isDone
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-300 text-gray-500"
                                    }`}
                            >
                                {isDone ? "✓" : ""}
                            </div>

                            {/* CONNECTOR LINE */}
                            {idx < steps.length - 1 && (
                                <div
                                    className={`h-4 w-[1px] ${isDone
                                            ? "bg-green-400"
                                            : "bg-gray-300"
                                        }`}
                                />
                            )}
                        </div>

                        {/* LABEL */}
                        <span
                            className={`leading-tight ${isDone
                                    ? "text-green-700 font-medium"
                                    : "text-gray-500"
                                } ${isCurrent ? "underline" : ""}`}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default DutySlipTimeline;
