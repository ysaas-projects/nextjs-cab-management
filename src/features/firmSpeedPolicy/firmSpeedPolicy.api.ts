// 📁 src/features/firmSpeedPolicy/firmSpeedPolicy.api.ts

import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
    FirmSpeedPolicy,
    CreateFirmSpeedPolicyPayload,
    UpdateFirmSpeedPolicyPayload,
    ApiResponse,
} from "./firmSpeedPolicy.types";

export const firmSpeedPolicyApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ===============================
        // GET ALL FIRM SPEED POLICIES
        // ===============================
        getFirmSpeedPolicies: builder.query<FirmSpeedPolicy[], void>({
            query: () => API_ROUTES.FIRM_SPEED_POLICIES,
            transformResponse: (res: ApiResponse<FirmSpeedPolicy[]>) => res.data,
            providesTags: ["FirmSpeedPolicy"],
        }),

        // ===============================
        // GET ACTIVE FIRM SPEED POLICY
        // ===============================
        getActiveFirmSpeedPolicy: builder.query<FirmSpeedPolicy, void>({
            query: () => `${API_ROUTES.FIRM_SPEED_POLICIES}/active`,
            transformResponse: (res: ApiResponse<FirmSpeedPolicy>) => res.data,
            providesTags: ["FirmSpeedPolicy"],
        }),

        // ===============================
        // CREATE FIRM SPEED POLICY
        // ===============================
        createFirmSpeedPolicy: builder.mutation<
            FirmSpeedPolicy,
            CreateFirmSpeedPolicyPayload
        >({
            query: (payload) => ({
                url: API_ROUTES.FIRM_SPEED_POLICIES,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<FirmSpeedPolicy>) => res.data,
            invalidatesTags: ["FirmSpeedPolicy"],
        }),

        // ===============================
        // UPDATE FIRM SPEED POLICY
        // ===============================
        updateFirmSpeedPolicy: builder.mutation<
            FirmSpeedPolicy,
            { id: number; payload: UpdateFirmSpeedPolicyPayload }
        >({
            query: ({ id, payload }) => ({
                url: `${API_ROUTES.FIRM_SPEED_POLICIES}/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<FirmSpeedPolicy>) => res.data,
            invalidatesTags: ["FirmSpeedPolicy"],
        }),

        // ===============================
        // DELETE FIRM SPEED POLICY (SOFT)
        // ===============================
        deleteFirmSpeedPolicy: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.FIRM_SPEED_POLICIES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FirmSpeedPolicy"],
        }),
    }),
});


export const {
    useGetFirmSpeedPoliciesQuery,
    useGetActiveFirmSpeedPolicyQuery,
    useCreateFirmSpeedPolicyMutation,
    useUpdateFirmSpeedPolicyMutation,
    useDeleteFirmSpeedPolicyMutation,
} = firmSpeedPolicyApi;