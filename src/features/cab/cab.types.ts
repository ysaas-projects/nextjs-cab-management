// cab/cab.types.ts

export interface Cab {
  cabId: number;
  firmId: number;
  firmName: string;
  cabType: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CabDto {
  cabId: number;
  firmId: number;
  firmName: string;
  cabType: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
