import { api } from "@/store/api";
import { ApiResponse } from "./user.types";

export interface User {
  userId: number;
  firmId?: number;
  firmType?: string;
  userName: string;
  email?: string;
  mobileNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET USER LIST
    // ===============================
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (res: ApiResponse<User[]>) => res.data,
      providesTags: ["Users"],
    }),

  }),
});

export const { useGetUsersQuery } = userApi;
