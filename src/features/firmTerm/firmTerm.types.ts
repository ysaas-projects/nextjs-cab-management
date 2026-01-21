// firmTerm/firmTerm.types.ts

export interface FirmTerm {
  firmTermId: number;
  firmId: number;
  FirmName:string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateFirmTermDto {
  description: string;
  isActive?: boolean;
}

export interface UpdateFirmTermDto {
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
