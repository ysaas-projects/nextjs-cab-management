export interface CustomerUser {
  customerUserId: number;
  customerId: number;
  firmId: number;
  userName: string;
  mobileNumber?: string | null;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CreateCustomerUserPayload {
  customerId: number;
  userName: string;
  mobileNumber?: string | null;
  isActive: boolean;
}

export interface UpdateCustomerUserPayload {
  userName: string;
  mobileNumber?: string | null;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: any;
}
