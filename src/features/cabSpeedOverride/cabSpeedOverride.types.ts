export interface CabSpeedOverride {
    cabSpeedOverrideId: number;
    cabId: number;
    firmId: number;

    avgSpeedOverride: number;
    reason?: string | null;

    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreateCabSpeedOverridePayload {
    cabId: number;
    avgSpeedOverride: number;
    reason?: string;
}

export interface UpdateCabSpeedOverridePayload {
    avgSpeedOverride: number;
    reason?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}