// firm/firmApi.ts

import { ApiResponse, Firm, FirmDto } from "./firm.types";
import { API_ROUTES } from "@/lib/apiRoutes";
import { api } from "@/store/api";

export const firmApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =====================
    // GET ALL FIRMS
    // =====================
    // Paginated firms (backend-driven pagination)
    getPaginatedFirms: builder.query<
      {
        totalCount: number;
        pageSize: number;
        currentPage: number;
        totalPages: number;
        items: Firm[];
      },
      { pageNumber: number; pageSize: number; search?: string; isActive?: boolean }
    >({
      query: ({ pageNumber, pageSize, search, isActive }) => {  
        const params = new URLSearchParams({
          pageNumber: pageNumber.toString(),
          pageSize: pageSize.toString(),
        });

        if (search) params.append("search", search);
        if (isActive !== undefined) params.append("isActive", String(isActive));

        return `${API_ROUTES.FIRMS}/paginated?${params.toString()}`;
      },
      transformResponse: (res: ApiResponse<any>) => res.data,
      providesTags: (result) =>
        result
          ? [
              { type: "Firm" as const, id: "LIST" as const },
              ...result.items.map((item: Firm) => ({ type: "Firm" as const, id: item.firmId })),
            ]
          : [{ type: "Firm" as const, id: "LIST" as const }],
    }),

    // GET ALL (non-paginated)
    getFirms: builder.query<Firm[], void>({
      query: () => API_ROUTES.FIRMS,
      transformResponse: (response: ApiResponse<Firm[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              { type: "Firm" as const, id: "LIST" as const },
              ...result.map((item: Firm) => ({ type: "Firm" as const, id: item.firmId })),
            ]
          : [{ type: "Firm" as const, id: "LIST" as const }],   
    }),

    // GET BY ID
    getFirmById: builder.query<Firm, number>({
        query: (id) => `${API_ROUTES.FIRMS}/${id}`,
        transformResponse: (res: ApiResponse<Firm>) => res.data,
        providesTags: (result) =>
            result ? [{ type: "Firm", id: result.firmId }] : [],
        }),
    // CREATE
    createFirm: builder.mutation<any, FirmDto>({
      query: (payload) => {
        // Backend CreateFirm uses [FromForm] FirmCreateDto,
        // so we send FormData instead of JSON (similar UI to cabs).
        const formData = new FormData();

        formData.append("FirmName", payload.firmName.trim());
        formData.append("FirmCode", payload.firmCode.trim());
        formData.append(
          "IsActive",
          String(payload.isActive ?? true)
        );

        return {
          url: API_ROUTES.FIRMS,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (res: ApiResponse<any>) => res.data,
      invalidatesTags: [{ type: "Firm", id: "LIST" }],
    }),

    // UPDATE
    updateFirm: builder.mutation<Firm, { id: number; body: FirmDto }>({
  query: ({ id, body }) => ({
    url: `${API_ROUTES.FIRMS}/${id}`,
    method: "PUT",
    body,
  }),
  transformResponse: (res: ApiResponse<Firm>) => res.data,
  invalidatesTags: (result) =>
    result
      ? [
          { type: "Firm", id: result.firmId },
          { type: "Firm", id: "LIST" },
        ]
      : [{ type: "Firm", id: "LIST" }],
}),

    // DELETE
    deleteFirm: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.FIRMS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Firm", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFirmsQuery,
  useGetPaginatedFirmsQuery,
  useGetFirmByIdQuery,
  useCreateFirmMutation,
  useUpdateFirmMutation,
  useDeleteFirmMutation,
} = firmApi;