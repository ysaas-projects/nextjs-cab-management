export const API_ROUTES = {
  STATES: "/states",
  CITIES: "/cities",
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
FIRMS:"/Firms",
  FIRM_DETAILS: "/FirmDetails",
  Users:"/Users",
  CabPrices:"/CabPrices",
  
  // Add Authebntication routes here in the future
  MILLS: "/mills",
  MILL_DETAILS: (id: number) => `/mills/mill-details/${id}`,

  COMPANIES: "/companies",
  COMPANY_DETAILS: (id: number) => `/companies/company-details/${id}`,

    PRODUCTS: "/products",
    PRODUCT_DETAILS: (id: number) => `/products/${id}/details`,
    KYC: "/kyc-documents/verification",
    KYC_UPDATE: "/kyc-documents/status",
    KYC_UPLOADS: (id: number) => `/kyc-documents/${id}`,
    PRODUCT_IMAGES: "/product-images",
    SELLING_PRICES: "/selling-prices",
    ORDERS: "/orders",
    CABS:"/Cabs",
    PRICING_RULES: "/PricingRules",
    // PRODUCT_DETAILS: (id: number) => `/products/${id}/details`,
   
};
