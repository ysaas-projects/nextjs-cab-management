// features/cabprice/cabprice.types.ts

export interface CabPrice {
  cabPriceId: number;

  firmId: number;
  firmName: string;      // ✅ NEW (backend)

  cabId: number;
  cabType: string;       // ✅ NEW (backend)

  pricingRuleId: number; // ✅ match backend name
  pricingRuleName:string;
  price: number;
  isActive: boolean;

  createdAt: string;
  updatedAt?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}
