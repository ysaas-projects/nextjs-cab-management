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


  startKms?: number | null;
  startDateTime?: string | null;

  closeKms?: number | null;
  closeDateTime?: string | null;

  destination?: string | null;
  paymentMode?: string | null;
  status?: string | null;

  createdAt?: string;
  updatedAt?: string;
}


// ===============================
// START JOURNEY
// ===============================
export interface UpdateStartJourneyRequest {
  dutySlipId: number;

  reportingGeoLocation?: string;
  startKms?: number;
  startKmsImagePath?: string;
  startDateTime?: string;
}

// ===============================
// END JOURNEY
// ===============================
export interface UpdateEndJourneyRequest {
  dutySlipId: number;

  closeKms?: number;
  closeKmsImagePath?: string;
  closeDateTime?: string;
  totalKms?: number;
  totalTimeInMin?: number;
}

// ===============================
// INSTRUCTION
// ===============================
export interface UpdateInstructionRequest {
  dutySlipId: number;
  nextDayInstruction: string;
}

// ===============================
// BILLING
// ===============================
export interface UpdateBillingRequest {
  dutySlipId: number;
  paymentMode: string;
}



// ===============================
// COMMON API RESPONSE
// ===============================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AssignDriverRequest {
  dutySlipId: number;

  driverDetailId: number;

  sentCab: number;      // cabId
  cabNumber: string;    // actual cab number string

reportingAddress: string;
reportingDateTime?: string;
}
