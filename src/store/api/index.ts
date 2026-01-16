// src/store/api/index.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Mill",
        "Company",
        "Product",
        "ProductImage",
        "SellingPrice",
        "State",
        "City",
        "KYC",
        "Cab",
        "PricingRule",
        "Firms",
        "Users",
        "CabPrices",

    ],
    endpoints: () => ({}),
});
