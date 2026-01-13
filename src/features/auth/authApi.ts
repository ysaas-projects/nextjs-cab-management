// src/features/auth/authApi.ts

import { api } from "@/store/api";


export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    userId: number;
    username: string;
    email: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: string;
}


export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string | null;
}

export const authApi = api.injectEndpoints({
    endpoints : (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body)=>({
                url: '/auth/login',
                method: 'POST',
                body,
            })
        }),


     changePassword: builder.mutation<void, { userId: number; body: ChangePasswordRequest }>({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/change-password`,
        method: "POST",
        body,
        credentials: "include", // ⬅️ important for cookies
      })
    //   invalidatesTags: ["User"], // optional
    }),


    }),
});


export const  { useLoginMutation,  useChangePasswordMutation } = authApi;

