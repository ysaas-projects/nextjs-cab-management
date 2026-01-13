import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
    State,
    CreateStatePayload,
    ApiResponse,
    PaginatedResponse,
} from "./state.types";

export const stateApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ===============================
        // GET ALL STATES
        // ===============================
        getStates: builder.query<State[], void>({
            query: () => API_ROUTES.STATES,
            transformResponse: (res: ApiResponse<State[]>) => res.data,
            providesTags: ["State"],
        }),

        // ===============================
        // GET PAGINATED STATES ✅ FIXED
        // ===============================
        getPaginatedStates: builder.query<
            PaginatedResponse<State>,
            { pageNumber: number; pageSize: number }
        >({
            query: ({ pageNumber, pageSize }) =>
                `${API_ROUTES.STATES}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,

            // ✅ SAME PATTERN AS MILL API (NO MANUAL MAPPING)
            transformResponse: (res: ApiResponse<PaginatedResponse<State>>) => res.data,

            providesTags: ["State"],
        }),

        // ===============================
        // GET STATE BY ID
        // ===============================
        getStateById: builder.query<State, number>({
            query: (id) => `${API_ROUTES.STATES}/${id}`,
            transformResponse: (res: ApiResponse<State>) => res.data,
            providesTags: (result, error, id) => [{ type: "State", id }],
        }),

        // ===============================
        // CREATE STATE
        // ===============================
        createState: builder.mutation<State, CreateStatePayload>({
            query: (payload) => ({
                url: API_ROUTES.STATES,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<State>) => res.data,
            invalidatesTags: ["State"],
        }),

        // ===============================
        // UPDATE STATE
        // ===============================
        updateState: builder.mutation<State, Partial<State>>({
            query: (payload) => ({
                url: `${API_ROUTES.STATES}/${payload.stateId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<State>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "State", id: result.stateId }] : ["State"],
        }),

        // ===============================
        // DELETE STATE (SOFT DELETE)
        // ===============================
        deleteState: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.STATES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["State"],
        }),

        // ===============================
        // UPDATE ACTIVE STATUS
        // ===============================
        updateStateStatus: builder.mutation<
            State,
            { stateId: number; isActive: boolean }
        >({
            query: ({ stateId, isActive }) => ({
                url: `${API_ROUTES.STATES}/UpdateStateActiveStatus/${stateId}/${isActive ? 1 : 0}`,
                method: "PUT",
            }),
            transformResponse: (res: ApiResponse<State>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "State", id: result.stateId }] : ["State"],
        }),
    }),
});

export const {
    useGetStatesQuery,
    useGetPaginatedStatesQuery,
    useGetStateByIdQuery,
    useCreateStateMutation,
    useUpdateStateMutation,
    useDeleteStateMutation,
    useUpdateStateStatusMutation,
} = stateApi;