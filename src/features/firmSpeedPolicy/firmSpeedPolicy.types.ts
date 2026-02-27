// src\features\firmSpeedPolicy\firmSpeedPolicy.types.ts

export interface FirmSpeedPolicy {
    firmSpeedPolicyId: number;
    firmId: number;

    dayAvgSpeed: number;
    nightAvgSpeed: number;
    minChargeableSpeed: number;
    graceMinutes: number;

    effectiveFrom: string;
    isActive: boolean;
}

export interface CreateFirmSpeedPolicyPayload {
    dayAvgSpeed: number;
    nightAvgSpeed: number;
    minChargeableSpeed: number;
    graceMinutes: number;
    effectiveFrom: string;
    isActive: boolean;
}

export interface UpdateFirmSpeedPolicyPayload {
    dayAvgSpeed?: number;
    nightAvgSpeed?: number;
    minChargeableSpeed?: number;
    graceMinutes?: number;
    isActive?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string | null;
    errors?: any;
}