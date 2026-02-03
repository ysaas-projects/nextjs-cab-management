export type DutySlipStatus =
    | "Booked"
    | "Driver-Assigned"
    | "Start-Journey"
    | "End-Journey"
    | "Bill-Pending"
    | "Instructed";

export const dutySlipActionsByStatus: Record<
    DutySlipStatus,
    {
        assignDriver?: boolean;
        startJourney?: boolean;
        endJourney?: boolean;
        billing?: boolean;
    }
> = {
    "Booked": {
        assignDriver: true,
    },

    "Driver-Assigned": {
        startJourney: true,
    },

    "Start-Journey": {
        endJourney: true,
    },

    "End-Journey": {
        billing: true,
    },

    "Bill-Pending": {},

    "Instructed": {},
};
