// features/cabprice/cabpriceApi.ts

import { api } from "@/store/api";
import { ApiResponse, CabPrice } from "./cabprice.types";

export const cabpriceApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET ALL CAB PRICES
    // ===============================
    getCabPrices: builder.query<CabPrice[], void>({
      query: () => "/cabprices",
      transformResponse: (res: ApiResponse<CabPrice[]>) => res.data,
      providesTags: ["CabPrices"],
    }),

    // ===============================
// GET CAB PRICE BY ID (VIEW)
// ===============================
getCabPrice: builder.query<CabPrice, number>({
  query: (id) => `/cabprices/${id}`,
  transformResponse: (res: ApiResponse<CabPrice>) => res.data,
  providesTags: ["CabPrices"],
}),
    // ===============================
    // GET CAB PRICES BY CAB ID
    // ===============================
    getCabPricesByCabId: builder.query<CabPrice[], number>({
      query: (cabId) => `/cabprices/by-cab/${cabId}`,
      transformResponse: (res: ApiResponse<CabPrice[]>) => res.data,
      providesTags: ["CabPrices"],
    }),

    // ===============================
    // CREATE CAB PRICE
    // ===============================
    createCabPrice: builder.mutation<
      CabPrice,
      {
        cabId: number;
        pricingRuleId: number;
        price: number;
        isActive?: boolean;
      }
    >({
      query: (payload) => ({
        url: "/cabprices",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<CabPrice>) => res.data,
      invalidatesTags: ["CabPrices"],
    }),

    // ===============================
    // UPDATE CAB PRICE
    // ===============================
    updateCabPrice: builder.mutation<
      CabPrice,
      {
        cabPriceId: number;
        payload: {
          firmId: number;
          cabId?: number;
          pricingRuleId?: number;
          price?: number;
          isActive?: boolean;
        };
      }
    >({
      query: ({ cabPriceId, payload }) => ({
        url: `/cabprices/${cabPriceId}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<CabPrice>) => res.data,
      invalidatesTags: ["CabPrices"],
    }),

    // ===============================
    // DELETE CAB PRICE (SOFT DELETE)
    // ===============================
    deleteCabPrice: builder.mutation<void, number>({
      query: (cabPriceId) => ({
        url: `/cabprices/${cabPriceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CabPrices"],
    }),
  }),
});

// ===============================
// EXPORT HOOKS
// ===============================
export const {
  useGetCabPricesQuery,
  useGetCabPricesByCabIdQuery,
  useCreateCabPriceMutation,
  useUpdateCabPriceMutation,
  useDeleteCabPriceMutation, 
    useGetCabPriceQuery, 


} = cabpriceApi;
