import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
    CabSpeedOverride,
    ApiResponse,
    CreateCabSpeedOverridePayload,
} from "./cabSpeedOverride.types";

export const cabSpeedOverrideApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ===============================
        // GET OVERRIDE BY CAB
        // ===============================
        getCabSpeedOverrideByCabId: builder.query<
            CabSpeedOverride | null,
            number
        >({
            query: (cabId) =>
                `${API_ROUTES.CAB_SPEED_OVERRIDES}/by-cab/${cabId}`,
            transformResponse: (
                res: ApiResponse<CabSpeedOverride>
            ) => res.data,
            providesTags: ["CabSpeedOverride"],
        }),

        // ===============================
        // CREATE / UPDATE (UPSERT)
        // ===============================
        saveCabSpeedOverride: builder.mutation<
            CabSpeedOverride,
            CreateCabSpeedOverridePayload
        >({
            query: (payload) => ({
                url: API_ROUTES.CAB_SPEED_OVERRIDES,
                method: "POST",
                body: payload,
            }),
            transformResponse: (
                res: ApiResponse<CabSpeedOverride>
            ) => res.data,
            invalidatesTags: ["CabSpeedOverride"],
        }),

        // ===============================
        // DELETE OVERRIDE
        // ===============================
        deleteCabSpeedOverride: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.CAB_SPEED_OVERRIDES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CabSpeedOverride"],
        }),
    }),
});

export const {
    useGetCabSpeedOverrideByCabIdQuery,
    useSaveCabSpeedOverrideMutation,
    useDeleteCabSpeedOverrideMutation,
} = cabSpeedOverrideApi;