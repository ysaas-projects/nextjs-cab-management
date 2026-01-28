// src/types/customer.types.ts
export interface Customer {
customerId: number;
firmId: number;
firmName?: string;
customerName: string;
address?: string;
gstNumber?: string;
logoImagePath?: string;
isActive: boolean;
isDeleted: boolean;
createdAt: string;
updatedAt?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
totalCount: number;
pageSize: number;
currentPage: number;
totalPages: number;
items: T[];
}