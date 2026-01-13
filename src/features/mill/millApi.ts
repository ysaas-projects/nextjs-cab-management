import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, Mill, PaginatedResponse, MillDetailsResponse } from "./mill.types";
import { API_ROUTES } from "@/lib/apiRoutes";
import { api } from "@/store/api";

export const millApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getMills: builder.query<Mill[], void>({
            query: () => API_ROUTES.MILLS,
            transformResponse: (response: ApiResponse<Mill[]>) => response.data,
            providesTags: ["Mill"],
        }),

        getPaginatedMills: builder.query<
            PaginatedResponse<Mill>,
            { pageNumber: number; pageSize: number }
        >({
            query: ({ pageNumber, pageSize }) =>
                `${API_ROUTES.MILLS}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            transformResponse: (res: ApiResponse<PaginatedResponse<Mill>>) => res.data,
            providesTags: ["Mill"],
        }),

        getMillById: builder.query<Mill, number>({
            query: (id) => `${API_ROUTES.MILLS}/${id}`,
            transformResponse: (res: ApiResponse<Mill>) => res.data,
            providesTags: (result, error, id) => [{ type: "Mill", id }],
        }),

        getMillDetails: builder.query<MillDetailsResponse, number>({
            query: (id) => API_ROUTES.MILL_DETAILS(id),
            transformResponse: (res: ApiResponse<MillDetailsResponse>) => res.data,
            providesTags: (result, error, id) => [
                { type: "Mill", id },
            ],
        }),

        createMill: builder.mutation<Mill, Partial<Mill>>({
            query: (payload) => ({
                url: API_ROUTES.MILLS,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<Mill>) => res.data,
            invalidatesTags: ["Mill"],
        }),

        updateMillStatus: builder.mutation<
            Mill,
            { millId: number; isActive: boolean }
        >({
            query: ({ millId, isActive }) => ({
                url: `${API_ROUTES.MILLS}/UpdateMillActiveStatus/${millId}/${isActive ? 1 : 0}`,
                method: "PUT",
            }),
            transformResponse: (res: ApiResponse<Mill>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "Mill", id: result.millId }] : ["Mill"],
        }),

        updateMill: builder.mutation<Mill, Partial<Mill>>({
            query: (payload) => ({
                url: `${API_ROUTES.MILLS}/${payload.millId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<Mill>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "Mill", id: result.millId }] : ["Mill"],
        }),
    }),
});

export const {
    useGetMillsQuery,
    useGetPaginatedMillsQuery,
    useGetMillByIdQuery,
    useGetMillDetailsQuery,
    useCreateMillMutation,
    useUpdateMillStatusMutation,
    useUpdateMillMutation,
} = millApi;
