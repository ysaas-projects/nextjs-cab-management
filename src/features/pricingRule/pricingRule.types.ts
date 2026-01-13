// src/features/pricingRule/pricingRule.types.ts

export interface CreatePricingRulePayload {
    firmId: number;
    roleDetails: string; // Assuming it's a JSON string or object
    isActive: boolean;
}

export interface UpdatePricingRulePayload {
    firmId?: number;
    roleDetails?: string;
    isActive?: boolean;
}

export interface PricingRule {
    pricingRuleId: number;
    firmId: number;
    roleDetails: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface PricingRuleResponseDto {
    pricingRuleId: number;
    firmId: number;
    roleDetails: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface PaginatedResponse<T> {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    data: T[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string | null;
    errors?: any;
}