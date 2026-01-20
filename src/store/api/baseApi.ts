import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logoutAction } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log("API call:", args, "Result:", result);
    // 🔴 If token expired
    if (result.error?.status === 401) {
        // Try refresh token automatically
        const refreshResult = await baseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            // Server sets new HttpOnly cookies automatically
            // Retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Logout if refresh fails
            api.dispatch(logoutAction());
        }
    }

    return result;
};
