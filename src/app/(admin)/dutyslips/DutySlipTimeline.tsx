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

const isCompleted = (
    current: string | null | undefined,
    step: string
) => {
    const order = steps.map((s) => s.key);
    return (
        !!current &&
        order.indexOf(current) >= order.indexOf(step)
    );
};

const DutySlipTimeline = ({ status }: Props) => {
    return (
        <div className="w-full flex items-center">
            {steps.map((step, idx) => {
                const done = isCompleted(status, step.key);

                return (
                    <div
                        key={step.key}
                        className="flex items-center flex-1 min-w-0"
                    >
                        {/* STEP */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div
                                className={`h-3 w-3 rounded-full ${done
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                            />

                            <span
                                className={`text-xs whitespace-nowrap ${done
                                        ? "text-green-700 font-medium"
                                        : "text-gray-500"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* CONNECTOR */}
                        {idx < steps.length - 1 && (
                            <div
                                className={`flex-1 h-[1px] mx-2 ${done
                                        ? "bg-green-300"
                                        : "bg-gray-300"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DutySlipTimeline;
