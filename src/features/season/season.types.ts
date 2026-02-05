// ===============================
// API RESPONSE
// ===============================
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ===============================
// ENTITY
// ===============================
export type Season = {
  seasonId: number;
  firmId: number;

  seasonName: string;
  startDate: string;   // ISO string
  endDate: string;

  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
};

// ===============================
// CREATE
// ===============================
export type CreateSeasonRequest = {
  seasonName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

// ===============================
// UPDATE
// ===============================
export type UpdateSeasonRequest = {
  seasonId: number;
  seasonName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};
