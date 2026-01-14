// cab/cabApi.ts

import { ApiResponse, Cab } from "./cab.types";
import { API_ROUTES } from "@/lib/apiRoutes";
import { api } from "@/store/api";

export const cabApi = api.injectEndpoints({
  endpoints: (builder) => ({


    // =====================
    // GET PAGINATED CABS
    // =====================
    getPaginatedCabs: builder.query<
    {
        totalCount: number;
        pageSize: number;
        currentPage: number;
        totalPages: number;
        items: Cab[];
    },
    { pageNumber: number; pageSize: number; search?: string; isActive?: boolean }
    >({
    query: ({ pageNumber, pageSize, search, isActive }) => {
        const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        });

        if (search) params.append("search", search);
        if (isActive !== undefined)
        params.append("isActive", String(isActive));

        return `${API_ROUTES.CABS}/paginated?${params.toString()}`;
    },
    transformResponse: (res: ApiResponse<any>) => res.data,
    providesTags: (result) =>
  result
    ? [
        ...result.items.map((cab) => ({
          type: "Cab" as const,
          id: cab.cabId,
        })),
        { type: "Cab", id: "LIST" },
      ]
    : [{ type: "Cab", id: "LIST" }],
    }),


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
    createCab: builder.mutation<any, { cabType: string; isActive: boolean }>({
  query: (payload) => ({
    url: API_ROUTES.CABS,
    method: "POST",
    body: payload, 
  }),
  transformResponse: (res: ApiResponse<any>) => res.data,
  invalidatesTags: ["Cab"],
}),

    // =====================
    // UPDATE CAB
    // =====================
updateCab: builder.mutation<any, { cabId: number; cabType?: string; isActive?: boolean }>({
  query: ({ cabId, ...body }) => ({
    url: `${API_ROUTES.CABS}/${cabId}`,
    method: "PUT",
    body,
  }),
      transformResponse: (res: ApiResponse<Cab>) => res.data,
      invalidatesTags: [{ type: "Cab", id: "LIST" }],
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
  useGetPaginatedCabsQuery,
  useGetCabByIdQuery,
  useCreateCabMutation,
  useUpdateCabMutation,
  useDeleteCabMutation,
} = cabApi;
