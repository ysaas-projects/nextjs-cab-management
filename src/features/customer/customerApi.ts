import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Customer } from "./customer.types";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET CUSTOMERS (PAGINATED)
    // ===============================
    getCustomersPaginated: builder.query<
      {
        totalCount: number;
        pageSize: number;
        currentPage: number;
        totalPages: number;
        items: Customer[];
      },
      {
        pageNumber?: number;
        pageSize?: number;
        search?: string;
        isActive?: boolean;
      }
    >({
      query: ({ pageNumber = 1, pageSize = 10, search, isActive }) => ({
        url: `${API_ROUTES.CUSTOMERS}/paginated`,
        params: {
          pageNumber,
          pageSize,
          search,
          isActive,
        },
      }),
      transformResponse: (res: ApiResponse<any>) => res.data,
      providesTags: ["Customers"],
    }),

    // ===============================
    // GET CUSTOMER BY ID
    // ===============================
    getCustomerById: builder.query<Customer, number>({
      query: (id) => `${API_ROUTES.CUSTOMERS}/${id}`,
      transformResponse: (res: ApiResponse<Customer>) => res.data,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    // ===============================
    // CREATE CUSTOMER (FORM DATA)
    // ===============================
    createCustomer: builder.mutation<
      Customer,
      FormData
    >({
      query: (payload) => ({
        url: API_ROUTES.CUSTOMERS,
        method: "POST",
        body: payload, // FormData → DO NOT set Content-Type
      }),
      transformResponse: (res: ApiResponse<Customer>) => res.data,
      invalidatesTags: ["Customers"],
    }),

    // ===============================
    // UPDATE CUSTOMER
    // ===============================
    updateCustomer: builder.mutation<
  Customer,
  { customerId: number; payload: FormData }
>({
  query: ({ customerId, payload }) => ({
    url: `${API_ROUTES.CUSTOMERS}/${customerId}`,
    method: "PUT",
    body: payload, // FormData
  }),
  transformResponse: (res: ApiResponse<Customer>) => res.data,
  invalidatesTags: ["Customers"],
}),

    // ===============================
    // DELETE CUSTOMER (SOFT DELETE)
    // ===============================
    deleteCustomer: builder.mutation<boolean, number>({
      query: (customerId) => ({
        url: `${API_ROUTES.CUSTOMERS}/${customerId}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<any>) => res.success,
      invalidatesTags: ["Customers"],
    }),

  }),
});

export const {
  useGetCustomersPaginatedQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
