// src/features/dutyslip/dutyslipApi.ts

import { api } from "@/store/api";
import {
  ApiResponse,
  AssignDriverRequest,
  CreateDutySlipRequest,
  DutySlip,
  UpdateStartJourneyRequest,
  UpdateEndJourneyRequest,
  UpdateInstructionRequest,
  UpdateBillingRequest,
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

    // ===============================
    // START JOURNEY
    // ===============================
    startJourney: builder.mutation<void, UpdateStartJourneyRequest>({
      query: ({ dutySlipId, ...body }) => ({
        url: `/dutyslips/${dutySlipId}/start-journey`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DutySlip"],
    }),

    // ===============================
    // END JOURNEY
    // ===============================
    endJourney: builder.mutation<void, UpdateEndJourneyRequest>({
      query: ({ dutySlipId, ...body }) => ({
        url: `/dutyslips/${dutySlipId}/end-journey`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DutySlip"],
    }),

    // ===============================
    // INSTRUCTION
    // ===============================
    updateInstruction: builder.mutation<void, UpdateInstructionRequest>({
      query: ({ dutySlipId, ...body }) => ({
        url: `/dutyslips/${dutySlipId}/instruction`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DutySlip"],
    }),

    // ===============================
    // BILLING
    // ===============================
    updateBilling: builder.mutation<void, UpdateBillingRequest>({
      query: ({ dutySlipId, ...body }) => ({
        url: `/dutyslips/${dutySlipId}/billing`,
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
  useAssignDriverMutation,

  useStartJourneyMutation,
  useEndJourneyMutation,
  useUpdateInstructionMutation,
  useUpdateBillingMutation,
} = dutySlipApi;
