// src/features/driverdetail/driverdetailApi.ts

import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse,CreateDriverDetailPayload,DriverDetail, UpdateDriverDetailPayload } from "./driverdetail.types";

export const driverDetailApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // =========================
    // GET ALL DRIVER DETAILS
    // =========================
    getDriverDetails: builder.query<DriverDetail[], void>({
      query: () => API_ROUTES.DRIVER_DETAILS,
      transformResponse: (res: ApiResponse<DriverDetail[]>) => res.data,
      providesTags: ["DriverDetail"],
    }),

    // =========================
    // GET DRIVER DETAIL BY ID
    // =========================
    getDriverDetailById: builder.query<DriverDetail, number>({
      query: (id) => `${API_ROUTES.DRIVER_DETAILS}/${id}`,
      transformResponse: (res: ApiResponse<DriverDetail>) => res.data,
      providesTags: (r, e, id) => [{ type: "DriverDetail", id }],
    }),

    // =========================
    // CREATE DRIVER DETAIL
    // =========================
    createDriverDetail: builder.mutation<
      DriverDetail,
      CreateDriverDetailPayload
    >({
      query: (payload) => ({
        url: API_ROUTES.DRIVER_DETAILS,
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<DriverDetail>) => res.data,
      invalidatesTags: ["DriverDetail"],
    }),

    // =========================
    // UPDATE DRIVER DETAIL
    // =========================
    updateDriverDetail: builder.mutation<
      DriverDetail,
      UpdateDriverDetailPayload
    >({
      query: ({ driverDetailId, ...payload }) => ({
        url: `${API_ROUTES.DRIVER_DETAILS}/${driverDetailId}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<DriverDetail>) => res.data,
      invalidatesTags: (result) =>
        result
          ? [{ type: "DriverDetail", id: result.driverDetailId }]
          : ["DriverDetail"],
    }),

    // =========================
    // DELETE DRIVER DETAIL (SOFT)
    // =========================
    deleteDriverDetail: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.DRIVER_DETAILS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DriverDetail"],
    }),
  }),
});

export const {
  useGetDriverDetailsQuery,
  useGetDriverDetailByIdQuery,
  useCreateDriverDetailMutation,
  useUpdateDriverDetailMutation,
  useDeleteDriverDetailMutation,
} = driverDetailApi;
