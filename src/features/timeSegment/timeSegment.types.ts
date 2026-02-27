// src/features/timeSegment/timeSegment.types.ts

export interface TimeSegment {
    timeSegmentId: number;
    firmId: number;

    segmentName: string; // Day / Night
    startTime: string;   // "06:00"
    endTime: string;     // "22:00"

    isActive: boolean;
    isDeleted: boolean;

    createdAt: string;
    updatedAt: string | null;
}

export interface CreateTimeSegmentPayload {
    segmentName: string;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    isActive: boolean;
}

export interface UpdateTimeSegmentPayload {
    segmentName?: string;
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string | null;
    errors?: any;
}