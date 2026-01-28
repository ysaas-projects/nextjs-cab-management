
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: string[];
  statusCode?: number;
}

export interface CabNumberDirectory {
  cabNumberDirectoryId: number;

  firmId: number;
  firmName?: string;

  cabId: number;
  cabType?: string;

  cabNumber: string;

  isActive: boolean;

  createdAt: string;
  updatedAt?: string;
}


export interface CreateCabNumberPayload {
  cabId: number;
  cabNumber: string;
  isActive?: boolean;
}


export interface UpdateCabNumberPayload {
  cabNumberDirectoryId: number;
  cabId: number;
  cabNumber: string;
  isActive: boolean;
}


export interface PaginatedCabNumberDirectory {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: CabNumberDirectory[];
}
