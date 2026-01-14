// firm/firmApi.ts

import { ApiResponse, Firm } from "./firm.types";
import { API_ROUTES } from "@/lib/apiRoutes";
import { api } from "@/store/api";

export const firmApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =====================
    // GET ALL FIRMS
    // =====================
    getFirms: builder.query<Firm[], void>({
      query: () => API_ROUTES.FIRMS,
      transformResponse: (response: ApiResponse<Firm[]>) => response.data,
      providesTags: ["Firm"],
    })

})
});

export const {
  useGetFirmsQuery,
} = firmApi;