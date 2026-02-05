import { api } from "@/store/api";
import {
  ApiResponse,
  CreatePackagePricingRequest,
  PackagePricing,
  UpdatePackagePricingRequest,
} from "./packagepricing.types";

export const packagePricingApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ===============================
    // GET ALL PACKAGE PRICINGS (GLOBAL)
    // ===============================
    getAllPackagePricings: builder.query<
      ApiResponse<PackagePricing[]>,
      void
    >({
      query: () => "/packagepricings",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({
                type: "PackagePricing" as const,
                id: p.pricingId,
              })),
              { type: "PackagePricing", id: "LIST" },
            ]
          : [{ type: "PackagePricing", id: "LIST" }],
    }),

    // ===============================
    // GET BY ID ✅ (FIX)
    // ===============================
    getPackagePricingById: builder.query<
      ApiResponse<PackagePricing>,
      number
    >({
      query: (pricingId) =>
        `/packagepricings/${pricingId}`,
      providesTags: (_r, _e, pricingId) => [
        { type: "PackagePricing", id: pricingId },
      ],
    }),

    // ===============================
    // GET BY PACKAGE (OPTIONAL)
    // ===============================
    getPackagePricingsByPackage: builder.query<
      ApiResponse<PackagePricing[]>,
      number
    >({
      query: (packageId) =>
        `/packagepricings/package/${packageId}`,
      providesTags: (_r, _e, packageId) => [
        { type: "PackagePricing", id: `LIST-${packageId}` },
      ],
    }),

    // ===============================
    // CREATE
    // ===============================
    createPackagePricing: builder.mutation<
      ApiResponse<PackagePricing>,
      CreatePackagePricingRequest
    >({
      query: (body) => ({
        url: "/packagepricings",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PackagePricing", id: "LIST" }],
    }),

    // ===============================
    // UPDATE
    // ===============================
    updatePackagePricing: builder.mutation<
      ApiResponse<boolean>,
      UpdatePackagePricingRequest
    >({
      query: ({ pricingId, ...body }) => ({
        url: `/packagepricings/${pricingId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "PackagePricing", id: arg.pricingId },
        { type: "PackagePricing", id: "LIST" },
      ],
    }),

    // ===============================
    // DELETE (SOFT)
    // ===============================
    deletePackagePricing: builder.mutation<
      ApiResponse<boolean>,
      number
    >({
      query: (pricingId) => ({
        url: `/packagepricings/${pricingId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PackagePricing", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllPackagePricingsQuery,
  useGetPackagePricingByIdQuery, // ✅ NOW EXISTS
  useGetPackagePricingsByPackageQuery,
  useCreatePackagePricingMutation,
  useUpdatePackagePricingMutation,
  useDeletePackagePricingMutation,
} = packagePricingApi;
