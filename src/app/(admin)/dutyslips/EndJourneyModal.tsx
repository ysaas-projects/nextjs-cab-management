"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";
import { useEndJourneyMutation } from "@/features/dutyslip/dutyslipApi";

type Props = {
    open: boolean;
    onClose: () => void;
    dutySlipId: number | null;

    // ✅ Required for auto calculation
    startKms: number | null;
    startDateTime: string | null;
};

const EndJourneyModal = ({
    open,
    onClose,
    dutySlipId,
    startKms,
    startDateTime,
}: Props) => {
    // ===============================
    // HOOKS (always run)
    // ===============================
    const [endJourney, { isLoading }] = useEndJourneyMutation();

    const [closeKms, setCloseKms] = useState("");
    const [closeDateTime, setCloseDateTime] = useState("");

    const [totalKms, setTotalKms] = useState<number | null>(null);
    const [totalTimeInMin, setTotalTimeInMin] =
        useState<number | null>(null);

    // ===============================
    // RESET WHEN MODAL OPENS
    // ===============================
    useEffect(() => {
        if (open) {
            setCloseKms("");
            setCloseDateTime("");
            setTotalKms(null);
            setTotalTimeInMin(null);
        }
    }, [open]);

    // ===============================
    // AUTO CALCULATE TOTAL KMS
    // ===============================

    useEffect(() => {
        console.log("START KMS =", startKms);
        console.log("CLOSE KMS =", closeKms);
    }, [startKms, closeKms]);

    useEffect(() => {
        if (startKms == null) {
            setTotalKms(null);
            return;
        }

        const close = parseFloat(closeKms);

        if (!isNaN(close) && close >= startKms) {
            setTotalKms(Number((close - startKms).toFixed(2)));
        } else {
            setTotalKms(null);
        }
    }, [closeKms, startKms]);


    // ===============================
    // AUTO CALCULATE TOTAL TIME
    // ===============================
    useEffect(() => {
        if (!startDateTime || !closeDateTime) {
            setTotalTimeInMin(null);
            return;
        }

        const start = new Date(startDateTime);
        const end = new Date(closeDateTime + ":00"); // ✅ normalize

        if (end > start) {
            const diffMs = end.getTime() - start.getTime();
            setTotalTimeInMin(Math.floor(diffMs / 60000));
        } else {
            setTotalTimeInMin(null);
        }
    }, [startDateTime, closeDateTime]);

    // ===============================
    // SUBMIT
    // ===============================
    const handleEnd = async () => {
        if (!dutySlipId) {
            enqueueSnackbar("Invalid duty slip", {
                variant: "error",
            });
            return;
        }

        if (!closeKms || !closeDateTime) {
            enqueueSnackbar(
                "Close KMs and Date-Time are required",
                { variant: "warning" }
            );
            return;
        }

        if (totalKms == null || totalTimeInMin == null) {
            enqueueSnackbar(
                "Invalid journey data",
                { variant: "warning" }
            );
            return;
        }

        try {
            await endJourney({
                dutySlipId,
                closeKms: Number(closeKms),
                closeDateTime: new Date(
                    closeDateTime
                ).toISOString(),
                totalKms,
                totalTimeInMin,
            }).unwrap();

            enqueueSnackbar("Journey ended successfully", {
                variant: "success",
            });

            onClose();
        } catch (err: any) {
            enqueueSnackbar(
                err?.data?.message || "Failed to end journey",
                { variant: "error" }
            );
        }
    };

    // ===============================
    // RENDER (always mounted)
    // ===============================
    if (!open) return <div className="hidden" />;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded bg-white p-4 space-y-3">
                <h2 className="text-lg font-semibold">
                    End Journey
                </h2>

                {/* CLOSE KMS */}
                <input
                    type="number"
                    placeholder="Close KMs"
                    className="w-full border rounded px-3 py-2"
                    value={closeKms}
                    onChange={(e) => setCloseKms(e.target.value)}
                />

                {/* CLOSE TIME */}
                <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2"
                    value={closeDateTime}
                    onChange={(e) =>
                        setCloseDateTime(e.target.value)
                    }
                />

                {/* AUTO CALCULATED */}
                <input
                    type="number"
                    placeholder="Total KMs"
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    value={totalKms ?? ""}
                    disabled
                />

                <input
                    type="number"
                    placeholder="Total Time (minutes)"
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    value={totalTimeInMin ?? ""}
                    disabled
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
                        variant="danger"
                        onClick={handleEnd}
                        disabled={isLoading}
                    >
                        {isLoading ? "Ending..." : "End Journey"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EndJourneyModal;
