import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  City,
  ApiResponse,
  PaginatedCityResponse,
} from "./city.types";

export const cityApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Get paginated cities
    getPaginatedCities: builder.query<
      PaginatedCityResponse,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber, pageSize }) =>
        `${API_ROUTES.CITIES}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (res: ApiResponse<PaginatedCityResponse>) => res.data,
      providesTags: ["City"],
    }),

    // Get all cities (optional use)
   getCities: builder.query<City[], void>({
      query: () => API_ROUTES.CITIES,
      transformResponse: (res: ApiResponse<City[]>) => res.data,
      providesTags: ["City"],
    }),

    // Get city by id
    getCityById: builder.query<City, number>({
      query: (id) => `${API_ROUTES.CITIES}/state/${id}`,
      transformResponse: (res: ApiResponse<City>) => res.data,
      providesTags: (result, error, id) => [{ type: "City", id }],
    }),

    // Create city
    createCity: builder.mutation<City, Partial<City>>({
      query: (payload) => ({
        url: API_ROUTES.CITIES,
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<City>) => res.data,
      invalidatesTags: ["City"],
    }),

    // Update city
    updateCity: builder.mutation<City, Partial<City>>({
      query: (payload) => ({
        url: `${API_ROUTES.CITIES}/${payload.cityId}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<City>) => res.data,
      invalidatesTags: (result) =>
        result ? [{ type: "City", id: result.cityId }] : ["City"],
    }),

    // Delete city
    deleteCity: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `${API_ROUTES.CITIES}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<any>) => res.success,
      invalidatesTags: ["City"],
    }),

  }),
});

export const {
  useGetCitiesQuery,
  
  useGetPaginatedCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = cityApi; 
