import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, User } from "./user.types";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET USERS
    // ===============================
    getUsers: builder.query<User[], void>({
      query: () => API_ROUTES.USERS,
      transformResponse: (res: ApiResponse<User[]>) => res.data,
      providesTags: ["Users"],
    }),

    // ===============================
    // GET USER BY ID (OPTIONAL BUT RECOMMENDED)
    // ===============================
    getUserById: builder.query<User, number>({
      query: (id) => `${API_ROUTES.USERS}/${id}`,
      transformResponse: (res: ApiResponse<User>) => res.data,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
} = userApi;
