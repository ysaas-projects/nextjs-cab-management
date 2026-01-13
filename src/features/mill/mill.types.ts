// src/features/mill/mill.types.ts

export interface CreateMillPayload {
    millName: string;
    millCode: string;
    address: string;
    cityId: number;
    stateId: number;
    contactPerson: string;
    contactNumber: string;
    email: string;
    gstNumber: string;
    pincode: string;
    country: string;
}

export interface Mill {
    millId: number;
    millName: string;
    millCode: string;
    address: string;

    cityId: number;
    cityName: string;

    stateId: number;
    stateName: string;

    country: string;
    isActive: boolean;

    contactPerson: string;
    contactNumber: string;
    email: string;
    gstNumber: string;
    pincode: string;

    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    data: T[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string | null;
    errors?: any;
}


// =======================
// MAIN MILL DETAILS TYPES
// =======================

export interface MillDetailsResponse {
    mill: Mill;
    users: User[];
    products: Product[];
    kycDocs: KycDoc[];
}

export interface Mill {
    millId: number;
    millName: string;
    millCode: string;
    address: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    gstNumber: string;
    country: string;
    isActive: boolean;
    pincode: string;
    createdAt: string;
    updatedAt: string;
}

// =======================
// USERS
// =======================
export interface User {
    userId: number;
    firmId: number;
    firmType: string;
    userName: string;
    email: string | null;
    mobileNumber: string | null;
    mobileNumberConfirmed: boolean;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string | null;
    isDeleted: boolean;
    userRoles: any[];
    userSessions: any[];
}

// =======================
// KYC
// =======================
export interface KycDoc {
    kycId: number;
    userId: number;
    documentId: number;
    documentNumber: string;
    documentPath: string;
    status: string;
    verifiedBy: string | null;
    verifiedAt: string | null;
    remarks: string;
    createdAt: string | null;
    updatedAt: string | null;
    isDeleted: boolean;
    user: User;
    documentType: DocumentType;
}

export interface DocumentType {
    documentId: number;
    documentTypeName: string;
    status: string;
    createdAt: string;
    updatedAt: string | null;
    isDeleted: boolean;
}


export interface ProductImage {
    productImagePath: string;
}

export interface Product {
    productId: number;
    productName: string;
    productGrade: string | null;
    millId: number;
    stockQuantity: number;
    millName?: string | null;
    status: boolean;
    currentPrice: number | null;
    sellingPrice: number | null;
    createdAt: string;
    images: ProductImage[];
}
