export interface State {
    stateId: number;
    stateName: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStatePayload {
    stateName: string;
    country: string;
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
