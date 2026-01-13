// cab/cab.types.ts

export interface Cab {
  cabId: number;
  firmId: number;
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

/** Common API response (same as mills) */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: string[];
}

/** Optional – if you add pagination later */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
