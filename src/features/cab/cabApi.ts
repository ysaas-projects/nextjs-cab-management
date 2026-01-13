// cab/cabApi.ts

import { ApiResponse, Cab } from "./cab.types";
import { API_ROUTES } from "@/lib/apiRoutes";
import { api } from "@/store/api";

export const cabApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // =====================
    // GET ALL CABS
    // =====================
    getCabs: builder.query<Cab[], void>({
      query: () => API_ROUTES.CABS,
      transformResponse: (response: ApiResponse<Cab[]>) => response.data,
      providesTags: ["Cab"],
    }),

    // =====================
    // GET CAB BY ID
    // =====================
    getCabById: builder.query<Cab, number>({
      query: (id) => `${API_ROUTES.CABS}/${id}`,
      transformResponse: (res: ApiResponse<Cab>) => res.data,
      providesTags: (result, error, id) => [{ type: "Cab", id }],
    }),

    // =====================
    // CREATE CAB
    // =====================
    createCab: builder.mutation<Cab, Partial<Cab>>({
      query: (payload) => ({
        url: API_ROUTES.CABS,
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<Cab>) => res.data,
      invalidatesTags: ["Cab"],
    }),

    // =====================
    // UPDATE CAB
    // =====================
    updateCab: builder.mutation<Cab, Partial<Cab>>({
      query: (payload) => ({
        url: `${API_ROUTES.CABS}/${payload.cabId}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<Cab>) => res.data,
      invalidatesTags: (result) =>
        result ? [{ type: "Cab", id: result.cabId }] : ["Cab"],
    }),

    // =====================
    // DELETE CAB (Soft Delete)
    // =====================
    deleteCab: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.CABS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cab"],
    }),
  }),
});

export const {
  useGetCabsQuery,
  useGetCabByIdQuery,
  useCreateCabMutation,
  useUpdateCabMutation,
  useDeleteCabMutation,
} = cabApi;
