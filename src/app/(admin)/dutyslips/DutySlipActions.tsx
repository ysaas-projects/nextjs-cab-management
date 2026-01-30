"use client";

import Button from "@/components/atoms/Button";
import { DutySlip } from "@/features/dutyslip/dutyslip.types";
import { dutySlipActionsByStatus, DutySlipStatus } from "./dutyslip.actions";

type Props = {
    slip: DutySlip;

    onAssign: () => void;
    onStart: () => void;
    onEnd: () => void;
    onBilling: () => void;
};

const DutySlipActions = ({
    slip,
    onAssign,
    onStart,
    onEnd,
    onBilling,
}: Props) => {
    const status = slip.status as DutySlipStatus | undefined;

    const actions = status
        ? dutySlipActionsByStatus[status]
        : {};
    return (
        <div className="flex gap-2">
            {actions.assignDriver && (
                <Button size="sm" onClick={onAssign}>
                    Assign Driver
                </Button>
            )}

            {actions.startJourney && (
                <Button size="sm" variant="primary" onClick={onStart}>
                    Start Journey
                </Button>
            )}

            {actions.endJourney && (
                <Button size="sm" variant="danger" onClick={onEnd}>
                    End Journey
                </Button>
            )}

            {actions.billing && (
                <Button size="sm" variant="secondary" onClick={onBilling}>
                    Billing
                </Button>
            )}
        </div>
    );
};

export default DutySlipActions;
