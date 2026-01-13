import { api } from "@/store/api";
import {
    ApiResponse,
    Company,
    CompanyDetailsResponse,
    PaginatedResponse,
} from "./company.types";
import { API_ROUTES } from "@/lib/apiRoutes";

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // =========================
        // GET ALL COMPANIES
        // =========================
        getCompanies: builder.query<Company[], void>({
            query: () => API_ROUTES.COMPANIES,
            transformResponse: (res: ApiResponse<Company[]>) => res.data,
            providesTags: ["Company"],
        }),

        // =========================
        // GET PAGINATED COMPANIES
        // =========================
        getPaginatedCompanies: builder.query<
            PaginatedResponse<Company>,
            {
                pageNumber: number;
                pageSize: number;
                search?: string;
                stateId?: number;
                cityId?: number;
                status?: boolean;
            }
        >({
            query: ({ pageNumber, pageSize, search, stateId, cityId, status }) => {
                const params = new URLSearchParams({
                    pageNumber: String(pageNumber),
                    pageSize: String(pageSize),
                });

                if (search) params.append("search", search);
                if (stateId) params.append("stateId", String(stateId));
                if (cityId) params.append("cityId", String(cityId));
                if (status !== undefined) params.append("status", String(status));

                return `${API_ROUTES.COMPANIES}/paginated?${params.toString()}`;
            },
            transformResponse: (res: ApiResponse<PaginatedResponse<Company>>) => res.data,
            providesTags: ["Company"],
        }),

        // =========================
        // GET COMPANY BY ID (BASIC)
        // =========================
        getCompanyById: builder.query<Company, number>({
            query: (id) => `${API_ROUTES.COMPANIES}/${id}`,
            transformResponse: (res: ApiResponse<Company>) => res.data,
            providesTags: (r, e, id) => [{ type: "Company", id }],
        }),

        // =========================
        // GET COMPANY DETAILS (FULL PROFILE)
        // =========================
        getCompanyDetails: builder.query<
            {
                company: Company;
                users: any[];
                kycDocs: any[];
            },
            number
        >({
            query: (id) => `${API_ROUTES.COMPANIES}/company-details/${id}`,
            transformResponse: (res: ApiResponse<any>) => res.data,
            providesTags: (r, e, id) => [{ type: "Company", id }],
        }),

        // =========================
        // UPDATE COMPANY STATUS
        // =========================
        updateCompanyStatus: builder.mutation<
            Company,
            { companyId: number; isActive: boolean }
        >({
            query: ({ companyId, isActive }) => ({
                url: `${API_ROUTES.COMPANIES}/UpdateCompanyActiveStatus/${companyId}/${isActive ? 1 : 0}`,
                method: "PUT",
                body: { isActive },
            }),
            invalidatesTags: (result) =>
                result ? [{ type: "Company", id: result.companyId }] : ["Company"],
        }),

        // =========================
        // CREATE COMPANY
        // =========================
        createCompany: builder.mutation<Company, Partial<Company>>({
            query: (payload) => ({
                url: API_ROUTES.COMPANIES,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<Company>) => res.data,
            invalidatesTags: ["Company"],
        }),

        // =========================
        // UPDATE COMPANY
        // =========================
        updateCompany: builder.mutation<
            Company,
            { companyId: number } & Partial<Company>
        >({
            query: ({ companyId, ...payload }) => ({
                url: `${API_ROUTES.COMPANIES}/${companyId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<Company>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "Company", id: result.companyId }] : ["Company"],
        }),

        // =========================
        // DELETE COMPANY
        // =========================
        deleteCompany: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ROUTES.COMPANIES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Company"],
        }),
    }),
});

export const {
    useGetCompaniesQuery,
    useGetPaginatedCompaniesQuery,
    useGetCompanyByIdQuery,
    useGetCompanyDetailsQuery,
    useUpdateCompanyStatusMutation,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
} = companyApi;
