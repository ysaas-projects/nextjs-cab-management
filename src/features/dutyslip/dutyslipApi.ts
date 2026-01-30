// src/features/dutyslip/dutyslipApi.ts

import { api } from "@/store/api";
import {
  ApiResponse,
  AssignDriverRequest,
  CreateDutySlipRequest,
  DutySlip,
} from "./dutyslip.types";

export const dutySlipApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // CREATE DUTY SLIP
    // ===============================
    createDutySlip: builder.mutation<
      DutySlip,
      CreateDutySlipRequest
    >({
      query: (body) => ({
        url: "/dutyslips",
        method: "POST",
        body,
      }),
      transformResponse: (
        res: ApiResponse<DutySlip>
      ) => res.data,
      invalidatesTags: ["DutySlip"],
    }),

    // ===============================
    // GET ALL DUTY SLIPS (Firm-wise)
    // ===============================
    getDutySlips: builder.query<
      DutySlip[],
      void
    >({
      query: () => "/dutyslips",
      transformResponse: (
        res: ApiResponse<DutySlip[]>
      ) => res.data,
      providesTags: ["DutySlip"],
    }),

    assignDriver: builder.mutation<
  void,
  AssignDriverRequest
>({
  query: ({ dutySlipId, ...body }) => ({
    url: `/dutyslips/${dutySlipId}/assign-driver`,
    method: "PUT",
    body,
  }),
  invalidatesTags: ["DutySlip"],
}),

  }),
});

export const {
  useCreateDutySlipMutation,
  useGetDutySlipsQuery,
    useAssignDriverMutation,   // ✅ ADD THIS

} = dutySlipApi;
