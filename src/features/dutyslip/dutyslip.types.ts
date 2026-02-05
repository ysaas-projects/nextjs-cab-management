// ===============================
// CREATE REQUEST (POST)
// ===============================
export interface CreateDutySlipRequest {
  bookedBy?: number;
  bookedDate: string;
  customerId: number;
  requestedCab?: number | null;
  destination: string;
  customerUserIds: number[];
}

export type DutySlipCustomerUser = {
  customerUserId: number;
  userName: string;
  mobileNumber: string;
};
// ===============================
// DUTY SLIP (INVOICE + DETAILS)
// ===============================
export type DutySlip = {
  dutySlipId: number;

  // 🔑 Booking
  bookedDate?: string;
  bookedBy?: number;

  // 👇 UI RULE: bookedBy = driverName (display purpose)
  bookedByName?: string | null;

  // 🔑 Firm
  firmId?: number;
  firmName?: string;

  // 🔑 Customer
  customerId?: number;
  customerName?: string | null;

  // ✅ Customer details (Invoice needs these)
  customerAddress?: string | null;
  customerGstNumber: string | null;
  customerMobile?: string | null;

  // 🔑 Driver / Cab
  driverDetailId?: number | null;
  driverName?: string | null;

  requestedCab?: number | null;
  requestedCabType?: string | null;

  sentCab?: number | null;
  sentCabType?: string | null;

  cabNumber?: string | null;

  // 🔑 Trip
  startKms?: number | null;
  startDateTime?: string | null;

  closeKms?: number | null;
  closeDateTime?: string | null;

  totalKms?: number | null;
  totalTimeInMin?: number | null;

  destination?: string | null;

  // 🔑 Billing
  paymentMode?: string | null;
  status?: string | null;

  // 🔑 Audit
  createdAt?: string;
  updatedAt?: string | null;
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

// ===============================
// ASSIGN DRIVER
// ===============================
export interface AssignDriverRequest {
  dutySlipId: number;
  driverDetailId: number;
  sentCab: number;
  cabNumber: string;
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
// DUTY SLIP + EXPENSES
// ===============================
export type DutySlipWithExpenses = {
  dutySlip: DutySlip;
  expenses: DutyExpense[];
  totalExpenseAmount: number;
  customerUsers: DutySlipCustomerUser[]; // ✅ ADD THIS

};
