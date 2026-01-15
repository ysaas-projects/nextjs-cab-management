import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, FirmWithDetails } from "./firm.types";

export const firmApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET ALL FIRMS
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
    // CREATE FIRM  (FromForm)
    // ===============================
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
    body: payload, // ✅ JSON body
    headers: {
      "Content-Type": "application/json",
    },
  }),
  transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
  invalidatesTags: ["Firms"],
}),
    // ===============================
    // UPDATE FIRM (optional, future)
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
        logoImagePath?: string;
      }
    >({
      query: ({ firmId, ...payload }) => ({
        url: `${API_ROUTES.FIRMS}/${firmId}`,
        method: "PUT",
        body: {
          firmId,
          ...payload, // ✅ Firm + FirmDetails
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (res: ApiResponse<FirmWithDetails>) => res.data,
      invalidatesTags: (result) =>
        result
          ? [{ type: "Firms", id: result.firmId }]
          : ["Firms"],
    }),

  }),
});

export const {
  useGetFirmsQuery,
  useGetFirmByIdQuery,
  useCreateFirmMutation,
  useUpdateFirmMutation,
} = firmApi;
