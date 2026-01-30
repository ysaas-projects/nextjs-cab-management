import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import type {
  ApiResponse,
  CreateCustomerUserPayload,
  CustomerUser,
  UpdateCustomerUserPayload,
} from "./customerUser.types";

export const customerUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ===============================
    // GET ALL CUSTOMER USERS
    // ===============================
    getCustomerUsers: builder.query<CustomerUser[], void>({
      query: () => API_ROUTES.CUSTOMER_USERS,
      transformResponse: (res: ApiResponse<CustomerUser[]>) => res.data,
      providesTags: ["CustomerUsers"],
    }),

    // ===============================
    // GET CUSTOMER USER BY ID
    // ===============================
    getCustomerUserById: builder.query<CustomerUser, number>({
      query: (id) => `${API_ROUTES.CUSTOMER_USERS}/${id}`,
      transformResponse: (res: ApiResponse<CustomerUser>) => res.data,
      providesTags: (result, error, id) => [{ type: "CustomerUsers", id }],
    }),

    // ===============================
    // GET CUSTOMER USERS BY CUSTOMER ID
    // ===============================
    getCustomerUsersByCustomerId: builder.query<CustomerUser[], number>({
      query: (customerId) =>
        `${API_ROUTES.CUSTOMER_USERS}/customer/${customerId}`,
      transformResponse: (res: ApiResponse<CustomerUser[]>) => res.data,
      providesTags: ["CustomerUsers"],
    }),

    // ===============================
    // CREATE CUSTOMER USER
    // ===============================
    createCustomerUser: builder.mutation<CustomerUser, CreateCustomerUserPayload>({
      query: (payload) => ({
        url: API_ROUTES.CUSTOMER_USERS,
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<CustomerUser>) => res.data,
      invalidatesTags: ["CustomerUsers"],
    }),

    // ===============================
    // UPDATE CUSTOMER USER
    // ===============================
    updateCustomerUser: builder.mutation<
      CustomerUser,
      { id: number; payload: UpdateCustomerUserPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${API_ROUTES.CUSTOMER_USERS}/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<CustomerUser>) => res.data,
      invalidatesTags: (result, error, arg) => [
        "CustomerUsers",
        { type: "CustomerUsers", id: arg.id },
      ],
    }),

    // ===============================
    // DELETE CUSTOMER USER (SOFT DELETE)
    // ===============================
    deleteCustomerUser: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `${API_ROUTES.CUSTOMER_USERS}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<any>) => res.success,
      invalidatesTags: ["CustomerUsers"],
    }),
  }),
});

export const {
  useGetCustomerUsersQuery,
  useGetCustomerUserByIdQuery,
  useGetCustomerUsersByCustomerIdQuery,
  useCreateCustomerUserMutation,
  useUpdateCustomerUserMutation,
  useDeleteCustomerUserMutation,
} = customerUserApi;
