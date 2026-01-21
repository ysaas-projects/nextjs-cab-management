// firm.types.ts

export interface Firm {
  firmId: number;
  firmName: string;
  firmCode?: string;
  isActive: boolean;
 
}

export interface FirmDetails {
  firmDetailsId?: number;
  firmId?: number;
  address?: string;
  contactNumber?: string;
  contactPerson?: string;
  logoImagePath?: string | null;
  gstNumber?: string;
  isActive?: boolean;
  
}


export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** ✅ UI JOINED TYPE (MATCHES BACKEND RESPONSE) */
export interface FirmWithDetails extends Firm {
  firmDetails?: FirmDetails;
}