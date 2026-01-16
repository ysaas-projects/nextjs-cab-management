export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface User {
  userId: number;
  firmId?: number;
  firmType?: string;
  userName: string;
  email?: string;
  mobileNumber?: string;
  isActive: boolean;
  createdAt: string;
}
