// src/features/dutyslip/dutyslipApi.ts

import { api } from "@/store/api";
import {
  ApiResponse,
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

  }),
});

export const {
  useCreateDutySlipMutation,
  useGetDutySlipsQuery,
} = dutySlipApi;
