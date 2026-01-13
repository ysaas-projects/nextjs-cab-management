export interface City {
  cityId: number;
  cityName: string;
  isActive: boolean;

  stateId?: number;      // present in DB but NOT used for CRUD UI
  stateName?: string;
}

export interface PaginatedCityResponse {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  data: City[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
  errors?: any;
}
