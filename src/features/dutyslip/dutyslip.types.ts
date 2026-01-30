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


export type DutySlip = {
  dutySlipId: number;
  customerName?: string | null;
  driverName?: string | null;

  requestedCabType?: string | null;
  sentCabType?: string | null;

  destination?: string | null;
  status?: string | null;

  startKms?: number | null;
  startDateTime?: string | null;

  closeKms?: number | null;
  closeDateTime?: string | null;

  totalKms?: number | null;
  totalTimeInMin?: number | null;
};


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


// ===============================
// DUTY EXPENSE
// ===============================
export type DutyExpense = {
  dutyExpenseId: number;
  dutyId: number;
  expenseType: string;
  description?: string | null;
  expenseAmount: string;
  createdAt: string;
};

// ===============================
// DUTY SLIP + EXPENSES (COMBINED)
// ===============================
export type DutySlipWithExpenses = {
  dutySlip: DutySlip;
  expenses: DutyExpense[];
  totalExpenseAmount: number;
};
