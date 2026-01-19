import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
    FirmTerm,
    ApiResponse,
    PaginatedResponse,
    CreateFirmTermPayload,
    UpdateFirmTermPayload,
} from "./firmTerm.types";

export const firmTermApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get all firm terms
        getFirmTerms: builder.query<FirmTerm[], void>({
            query: () => API_ROUTES.FIRM_TERMS,
            transformResponse: (res: ApiResponse<FirmTerm[]>) => res.data,
            providesTags: ["FirmTerms"],
        }),

        // Get paginated firm terms
        getPaginatedFirmTerms: builder.query<
            PaginatedResponse<FirmTerm>,
            { pageNumber: number; pageSize: number }
        >({
            query: ({ pageNumber, pageSize }) =>
                `${API_ROUTES.FIRM_TERMS}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            transformResponse: (res: ApiResponse<PaginatedResponse<FirmTerm>>) => res.data,
            providesTags: ["FirmTerms"],
        }),

        // Get firm term by ID
        getFirmTermById: builder.query<FirmTerm, number>({
            query: (id) => `${API_ROUTES.FIRM_TERMS}/${id}`,
            transformResponse: (res: ApiResponse<FirmTerm>) => res.data,
            providesTags: (result, error, id) => [{ type: "FirmTerms", id }],
        }),

        // Create firm term
        createFirmTerm: builder.mutation<FirmTerm, CreateFirmTermPayload>({
            query: (payload) => ({
                url: API_ROUTES.FIRM_TERMS,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<FirmTerm>) => res.data,
            invalidatesTags: ["FirmTerms"],
        }),

        // Update firm term
        updateFirmTerm: builder.mutation<
            FirmTerm,
            { id: number; payload: UpdateFirmTermPayload }
        >({
            query: ({ id, payload }) => ({
                url: `${API_ROUTES.FIRM_TERMS}/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<FirmTerm>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "FirmTerms", id: result.firmTermId }] : ["FirmTerms"],
        }),

        // Delete firm term
        deleteFirmTerm: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.FIRM_TERMS}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FirmTerms"],
        }),
    }),
});

export const {
    useGetFirmTermsQuery,
    useGetPaginatedFirmTermsQuery,
    useGetFirmTermByIdQuery,
    useCreateFirmTermMutation,
    useUpdateFirmTermMutation,
    useDeleteFirmTermMutation,
} = firmTermApi;
