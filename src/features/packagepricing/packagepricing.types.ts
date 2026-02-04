export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};// ===============================
// ENTITY
// ===============================
export type PackagePricing = {
  pricingId: number;
  packageName:string;
  packageId: number;
  dayType: "Weekday" | "Weekend";
  pricePerPerson: number;
  minPersons: number;
  createdAt: string;
  isDeleted: boolean;
};

// ===============================
// CREATE
// ===============================
export type CreatePackagePricingRequest = {
  packageId: number;
    packageName:string;

  dayType: "Weekday" | "Weekend";
  pricePerPerson: number;
  minPersons: number;
};

// ===============================
// UPDATE
// ===============================
export type UpdatePackagePricingRequest = {
  pricingId: number;
  dayType: "Weekday" | "Weekend";
  pricePerPerson: number;
  minPersons: number;
};
