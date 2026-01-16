import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, PricingRule, PaginatedResponse, CreatePricingRulePayload, UpdatePricingRulePayload } from "./pricingRule.types";
import { API_ROUTES } from "@/lib/apiRoutes";
import { api } from "@/store/api";

export const pricingRuleApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getPricingRules: builder.query<PricingRule[], void>({
            query: () => API_ROUTES.PRICING_RULES,
            transformResponse: (response: ApiResponse<PricingRule[]>) => response.data,
            providesTags: ["PricingRule"],
        }),

        getPaginatedPricingRules: builder.query<
            PaginatedResponse<PricingRule>,
            { pageNumber: number; pageSize: number }
        >({
            query: ({ pageNumber, pageSize }) =>
                `${API_ROUTES.PRICING_RULES}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            transformResponse: (res: ApiResponse<PaginatedResponse<PricingRule>>) => res.data,
            providesTags: ["PricingRule"],
        }),

        getPricingRuleById: builder.query<PricingRule, number>({
            query: (id) => `${API_ROUTES.PRICING_RULES}/${id}`,
            transformResponse: (res: ApiResponse<PricingRule>) => res.data,
            providesTags: (result, error, id) => [{ type: "PricingRule", id }],
        }),

        createPricingRule: builder.mutation<PricingRule, CreatePricingRulePayload>({
            query: (payload) => ({
                url: API_ROUTES.PRICING_RULES,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<PricingRule>) => res.data,
            invalidatesTags: ["PricingRule"],
        }),

        updatePricingRule: builder.mutation<PricingRule, { id: number; payload: UpdatePricingRulePayload }>({
            query: ({ id, payload }) => ({
                url: `${API_ROUTES.PRICING_RULES}/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<PricingRule>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "PricingRule", id: result.pricingRuleId }] : ["PricingRule"],
        }),

        deletePricingRule: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.PRICING_RULES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PricingRule"],
        }),
    }),
});

export const {
    useGetPricingRulesQuery,
    useGetPaginatedPricingRulesQuery,
    useGetPricingRuleByIdQuery,
    useCreatePricingRuleMutation,
    useUpdatePricingRuleMutation,
    useDeletePricingRuleMutation,
} = pricingRuleApi;