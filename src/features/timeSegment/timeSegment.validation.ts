// src/features/timeSegment/timeSegment.validation.ts

import { z } from "zod";

export const timeSegmentSchema = z
    .object({
        segmentName: z
            .string()
            .min(1, "Segment name is required")
            .max(20, "Max 20 characters"),

        startTime: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),

        endTime: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),

        isActive: z.boolean(),
    })
    .refine(
        (data) => data.startTime !== data.endTime,
        {
            message: "Start time and end time cannot be same",
            path: ["endTime"],
        }
    );

export type TimeSegmentFormValues = z.infer<typeof timeSegmentSchema>;