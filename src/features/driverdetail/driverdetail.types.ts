// src/features/driverdetail/driverdetail.types.ts

// =======================
// CREATE / UPDATE PAYLOADS
// =======================

export interface CreateDriverDetailPayload {
  // userId: number;
  driverName: string;
  mobileNumber: string;
  isActive?: boolean;
  
}

export interface UpdateDriverDetailPayload {
  driverDetailId: number;
  // userId: number;
  driverName: string;
  mobileNumber?: string;
  isActive?: boolean;
  // isDeleted?: boolean;
}

// =======================
// DRIVER DETAIL MODEL
// =======================

export interface DriverDetail {
  driverDetailId: number;
 
  driverName?: string | null;
  mobileNumber?: string | null;
   // ✅ ADD THESE
  firmId?: number | null;
  firmName?: string | null;

  userId?: number | null;
  userName?: string | null;

  isActive?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean | null;
}

// =======================
// PAGINATION
// =======================

export interface PaginatedResponse<T> {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  data: T[];
}

// =======================
// GENERIC API RESPONSE
// =======================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: any;
}

// =======================
// RESPONSE TYPES
// =======================

export type DriverDetailListResponse = ApiResponse<DriverDetail[]>;
export type DriverDetailResponse = ApiResponse<DriverDetail>;
