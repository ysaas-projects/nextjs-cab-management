export interface CreateFirmTermPayload {
    firmId: number;
    description: string;
    isActive: boolean;
}

export interface UpdateFirmTermPayload {
    firmId?: number;
    description?: string;
    isActive?: boolean;
}

export interface FirmTerm {
    firmTermId: number;
    firmId: number;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface FirmTermResponseDto {
    firmTermId: number;
    firmId: number;
    description: string;
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
