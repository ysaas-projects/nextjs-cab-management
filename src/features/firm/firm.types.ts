// firm/firm.types.ts

export interface Firm {
  firmId: number;
  firmName: string;
  firmCode: string;
  isActive: boolean;
  IsDeleted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: string[];
}