import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, FirmWithDetails } from "./firm.types";

export const firmApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getFirms: builder.query<FirmWithDetails[], void>({
      query: () => API_ROUTES.FIRMS,
      transformResponse: (res: ApiResponse<FirmWithDetails[]>) => res.data,
      providesTags: ["Firms"],
    }),

    getFirmById: builder.query<FirmWithDetails, number>({
      query: (id) => `${API_ROUTES.FIRMS}/${id}`,
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      providesTags: (result, error, id) => [{ type: "Firms", id }],
    }),

    createFirm: builder.mutation<
      FirmWithDetails,
      {
        firmName: string;
        firmCode: string;
        isActive: boolean;
        address?: string;
        contactNumber?: string;
        contactPerson?: string;
        gstNumber?: string;
        logoImagePath?: string;
      }
    >({
      query: (payload) => ({
        url: API_ROUTES.FIRMS,
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      invalidatesTags: ["Firms"],
    }),

    updateFirm: builder.mutation<
      FirmWithDetails,
      {
        firmId: number;
        firmName: string;
        firmCode: string;
        isActive: boolean;
        address?: string;
        contactNumber?: string;
        contactPerson?: string;
        gstNumber?: string;
        logoImagePath?: string;
      }
    >({
      query: ({ firmId, ...payload }) => ({
        url: `${API_ROUTES.FIRMS}/${firmId}`,
        method: "PUT",
        body: { firmId, ...payload },
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      invalidatesTags: ["Firms"],
    }),

    // ✅ DELETE
    deleteFirm: builder.mutation<boolean, number>({
      query: (firmId) => ({
        url: `${API_ROUTES.FIRMS}/${firmId}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<any>) => res.success,
      invalidatesTags: ["Firms"],
    }),

  }),
});
export const {
  useGetFirmsQuery,
  useGetFirmByIdQuery,
  useCreateFirmMutation,
  useUpdateFirmMutation,
  useDeleteFirmMutation, // ✅ ADD THIS
} = firmApi;