// firmTerm/firmTermApi.ts

import { ApiResponse, FirmTerm, CreateFirmTermDto, UpdateFirmTermDto } from "./firmTerm.types";
import { api } from "@/store/api";

export const firmTermApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL FIRM TERMS
    getFirmTerms: builder.query<FirmTerm[], void>({
      query: () => "/FirmTerms",
      transformResponse: (res: ApiResponse<FirmTerm[]>) => res.data,
      providesTags: (result) =>
        result
          ? [
              { type: "FirmTerm" as const, id: "LIST" as const },
              ...result.map((t) => ({ type: "FirmTerm" as const, id: t.firmTermId })),
            ]
          : [{ type: "FirmTerm" as const, id: "LIST" as const }],
    }),

    // GET BY ID
    getFirmTermById: builder.query<FirmTerm, number>({
      query: (id) => `/FirmTerms/${id}`,
      transformResponse: (res: ApiResponse<FirmTerm>) => res.data,
      providesTags: (result, error, id) => [{ type: "FirmTerm" as const, id }],
    }),

    // GET BY FIRM ID
    getFirmTermsByFirmId: builder.query<FirmTerm[], number>({
      query: (firmId) => `/FirmTerms/Firms/${firmId}`,
      transformResponse: (res: ApiResponse<FirmTerm[]>) => res.data,
      providesTags: (result, error, firmId) =>
        result
          ? [
              { type: "FirmTerm" as const, id: `FIRM-${firmId}` },
              ...result.map((t) => ({ type: "FirmTerm" as const, id: t.firmTermId })),
            ]
          : [{ type: "FirmTerm" as const, id: `FIRM-${firmId}` }],
    }),

    // CREATE
    createFirmTerm: builder.mutation<FirmTerm, CreateFirmTermDto>({
      query: (body) => ({
        url: "/FirmTerms",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<FirmTerm>) => res.data,
      invalidatesTags: (result) =>
        result
          ? [
              { type: "FirmTerm" as const, id: "LIST" as const },
              { type: "FirmTerm" as const, id: `FIRM-${result.firmId}` },
            ]
          : [{ type: "FirmTerm" as const, id: "LIST" as const }],
    }),

    // UPDATE
    updateFirmTerm: builder.mutation<FirmTerm, { id: number; body: UpdateFirmTermDto }>({
      query: ({ id, body }) => ({
        url: `/FirmTerms/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<FirmTerm>) => res.data,
      invalidatesTags: (result) =>
        result
          ? [
              { type: "FirmTerm" as const, id: result.firmTermId },
              { type: "FirmTerm" as const, id: "LIST" as const },
              { type: "FirmTerm" as const, id: `FIRM-${result.firmId}` },
            ]
          : [{ type: "FirmTerm" as const, id: "LIST" as const }],
    }),

    // DELETE (SOFT DELETE)
    deleteFirmTerm: builder.mutation<void, number>({
      query: (id) => ({
        url: `/FirmTerms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "FirmTerm" as const, id: "LIST" as const }],
    }),
  }),
});

export const {
  useGetFirmTermsQuery,
  useGetFirmTermByIdQuery,
  useGetFirmTermsByFirmIdQuery,
  useCreateFirmTermMutation,
  useUpdateFirmTermMutation,
  useDeleteFirmTermMutation,
} = firmTermApi;