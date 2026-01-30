// src/features/dutyslip/dutyslip.types.ts

// ===============================
// CREATE REQUEST (POST)
// ===============================
export interface CreateDutySlipRequest {
  bookedBy?: number; 
  bookedDate: string;       
  customerId: number;
  requestedCab?: number | null;
  destination: string;
}

// ===============================
// DUTY SLIP LIST ITEM (GET)
// ===============================
export interface DutySlip {
  dutySlipId: number;

  bookedDate: string;
  bookedBy: number;
  bookedByName?: string | null;

  firmId: number;
  firmName?: string | null;

  customerId: number;
  customerName?: string | null;

  driverDetailId?: number | null;
  driverName?: string | null;

  requestedCab?: number | null;
  requestedCabType?: string | null;

  sentCab?: number | null;
  sentCabType?: string | null;

  destination?: string | null;
  status?: string | null;

  createdAt?: string;
}

// ===============================
// COMMON API RESPONSE
// ===============================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
