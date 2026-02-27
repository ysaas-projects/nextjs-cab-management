// 📁 src/features/timeSegment/timeSegment.api.ts

import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
    TimeSegment,
    ApiResponse,
    CreateTimeSegmentPayload,
    UpdateTimeSegmentPayload,
} from "./timeSegment.types";

export const timeSegmentApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ===============================
        // GET ALL TIME SEGMENTS
        // ===============================
        getTimeSegments: builder.query<TimeSegment[], void>({
            query: () => API_ROUTES.TIME_SEGMENTS,
            transformResponse: (res: ApiResponse<TimeSegment[]>) => res.data,
            providesTags: ["TimeSegment"],
        }),

        // ===============================
        // GET TIME SEGMENT BY ID
        // ===============================
        getTimeSegmentById: builder.query<TimeSegment, number>({
            query: (id) => `${API_ROUTES.TIME_SEGMENTS}/${id}`,
            transformResponse: (res: ApiResponse<TimeSegment>) => res.data,
            providesTags: (result, error, id) => [
                { type: "TimeSegment", id },
            ],
        }),

        // ===============================
        // CREATE TIME SEGMENT
        // ===============================
        createTimeSegment: builder.mutation<
            TimeSegment,
            CreateTimeSegmentPayload
        >({
            query: (payload) => ({
                url: API_ROUTES.TIME_SEGMENTS,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<TimeSegment>) => res.data,
            invalidatesTags: ["TimeSegment"],
        }),

        // ===============================
        // UPDATE TIME SEGMENT
        // ===============================
        updateTimeSegment: builder.mutation<
            TimeSegment,
            { id: number; payload: UpdateTimeSegmentPayload }
        >({
            query: ({ id, payload }) => ({
                url: `${API_ROUTES.TIME_SEGMENTS}/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<TimeSegment>) => res.data,
            invalidatesTags: (result) =>
                result
                    ? [{ type: "TimeSegment", id: result.timeSegmentId }]
                    : ["TimeSegment"],
        }),

        // ===============================
        // DELETE TIME SEGMENT (SOFT)
        // ===============================
        deleteTimeSegment: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.TIME_SEGMENTS}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TimeSegment"],
        }),
    }),
});

export const {
    useGetTimeSegmentsQuery,
    useGetTimeSegmentByIdQuery,
    useCreateTimeSegmentMutation,
    useUpdateTimeSegmentMutation,
    useDeleteTimeSegmentMutation,
} = timeSegmentApi;