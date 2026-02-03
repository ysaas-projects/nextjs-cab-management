// ===============================
// API RESPONSE WRAPPER
// ===============================
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ===============================
// ENTITY (matches backend + DB)
// ===============================
export type TourPackage = {
  packageId: number;          // ✅ matches backend
  firmId?: number | null;

  packageName: string;
  description?: string | null;
  location?: string | null;

  durationDays?: number | null;
  durationNights?: number | null;

  basePrice: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt?: string | null;
};

// ===============================
// CREATE
// ===============================
export type CreateTourPackageRequest = {
  packageName: string;
  description?: string;
  location?: string;
  durationDays?: number;
  durationNights?: number;
  basePrice: number;
    isActive?: boolean;

};

// ===============================
// UPDATE
// ===============================
export type UpdateTourPackageRequest = {
      tourPackageId: number; // ✅ REQUIRED

  packageName?: string;
  description?: string;
  location?: string;
  durationDays?: number;
  durationNights?: number;
  basePrice?: number;
  isActive?: boolean;
};
