import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, FirmWithDetails } from "./firm.types";

export const firmApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET ALL FIRMS (Super-Admin)
    // ===============================
    getFirms: builder.query<FirmWithDetails[], void>({
      query: () => API_ROUTES.FIRMS,
      transformResponse: (res: ApiResponse<FirmWithDetails[]>) => res.data,
      providesTags: ["Firms"],
    }),

    // ===============================
    // GET FIRM BY ID
    // ===============================
    getFirmById: builder.query<FirmWithDetails, number>({
      query: (id) => `${API_ROUTES.FIRMS}/${id}`,
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      providesTags: (result, error, id) => [{ type: "Firms", id }],
    }),

    // ===============================
    // CREATE FIRM (WITH LOGO)
    // ===============================
    createFirm: builder.mutation<FirmWithDetails, FormData>({
      query: (formData) => ({
        url: API_ROUTES.FIRMS,
        method: "POST",
        body: formData, // multipart/form-data
      }),
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      invalidatesTags: ["Firms"],
    }),

    // ===============================
    // UPDATE FIRM (NO LOGO HERE)
    // ===============================
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
        logoImagePath?: string; // ⚠️ kept for compatibility, not upload
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

    // ===============================
    // ✅ UPDATE FIRM LOGO (REAL ONE)
    // ===============================
    updateFirmLogo: builder.mutation<
      any,
      { firmDetailsId: number; formData: FormData }
    >({
      query: ({ firmDetailsId, formData }) => ({
        url: `FirmDetails/${firmDetailsId}`,
        method: "PUT",
        body: formData, // multipart/form-data
      }),
      invalidatesTags: ["Firms"],
    }),

    // ===============================
    // GET LOGIN FIRM
    // ===============================
    getMyFirm: builder.query<FirmWithDetails, void>({
      query: () => `${API_ROUTES.FIRMS}/me`,
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      providesTags: ["Firms"],
    }),

    // ===============================
    // DELETE FIRM
    // ===============================
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
  useUpdateFirmLogoMutation, // ✅ IMPORTANT
  useDeleteFirmMutation,
  useGetMyFirmQuery,
} = firmApi;
