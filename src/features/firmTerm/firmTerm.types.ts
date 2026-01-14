// firmTerm/firmTerm.types.ts

export interface FirmTerm {
  firmTermId: number;
  firmId: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateFirmTermDto {
  firmId: number;
  description: string;
  isActive?: boolean;
}

export interface UpdateFirmTermDto {
  firmId?: number;
  description: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: string[];
}
