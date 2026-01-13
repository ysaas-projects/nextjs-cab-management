// src/features/company/company.types.ts

// =======================
// CREATE / UPDATE PAYLOADS
// =======================

export interface CreateCompanyPayload {
    companyCode: string;
    companyName: string;
    businessType?: string;
    gstNumber?: string;
    panNumber?: string;
    address?: string;
    cityId: number;
    stateId: number;
    pincode?: string;
    country?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export interface UpdateCompanyPayload extends CreateCompanyPayload {
    companyId: number;
    isActive: boolean;
}

// =======================
// COMPANY RESPONSE MODEL
// =======================

export interface Company {
    companyId: number;
    companyCode: string;
    companyName: string;
    businessType?: string;
    gstNumber?: string;
    panNumber?: string;
    address?: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    pincode?: string;
    country: string;
    contactEmail?: string;
    contactPhone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CompanyApiResponse {
    companyId: number;
    companyCode: string;
    companyName: string;
    businessType: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    pincode: string;
    country: string;
    contactEmail: string | null;
    contactPhone: string | null;
    isActive: boolean;
}


export interface CompanyUser {
    userId: number;
    userName: string;
    email: string;
    isActive: boolean;
}

export interface KYCDocument {
    kycId: number;
    documentType: {
        documentTypeName: string;
    };
    documentNumber?: string;
    status: string;
    remarks?: string;
}

export interface CompanyDetailsResponse {
    company: Company;
    users: CompanyUser[];
    kycDocs: KYCDocument[];
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
// COMPANY LIST RESPONSE
// =======================

export type CompanyListResponse = ApiResponse<PaginatedResponse<Company>>;

// =======================
// SINGLE COMPANY RESPONSE
// =======================

export type CompanyResponse = ApiResponse<Company>;
