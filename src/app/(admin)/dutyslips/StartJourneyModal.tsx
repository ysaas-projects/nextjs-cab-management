"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import { enqueueSnackbar } from "notistack";
import { useStartJourneyMutation } from "@/features/dutyslip/dutyslipApi";

type Props = {
    open: boolean;
    onClose: () => void;
    dutySlipId: number | null;
};

const StartJourneyModal = ({ open, onClose, dutySlipId }: Props) => {
    const [startJourney, { isLoading }] = useStartJourneyMutation();

    const [reportingGeoLocation, setReportingGeoLocation] = useState("");
    const [startKms, setStartKms] = useState<string>("");
    const [startDateTime, setStartDateTime] = useState("");

    if (!open) return null;

    const handleStart = async () => {
        if (!startKms || !startDateTime) {
            enqueueSnackbar("Start Kms and Date-Time are required", {
                variant: "warning",
            });
            return;
        }

        try {
            await startJourney({
                dutySlipId: dutySlipId!,
                reportingGeoLocation,
                startKms: Number(startKms),
                startDateTime,
            }).unwrap();

            enqueueSnackbar("Journey started successfully", {
                variant: "success",
            });

            onClose();
        } catch (err: any) {
            enqueueSnackbar(
                err?.data?.message || "Failed to start journey",
                { variant: "error" }
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded bg-white p-4 space-y-3">
                <h2 className="text-lg font-semibold">
                    Start Journey
                </h2>

                <input
                    type="text"
                    placeholder="Reporting Geo Location"
                    className="w-full border rounded px-3 py-2"
                    value={reportingGeoLocation}
                    onChange={(e) => setReportingGeoLocation(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Start KMs"
                    className="w-full border rounded px-3 py-2"
                    value={startKms}
                    onChange={(e) => setStartKms(e.target.value)}
                />

                <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
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
                        onClick={handleStart}
                        disabled={isLoading}
                    >
                        {isLoading ? "Starting..." : "Start Journey"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StartJourneyModal;
