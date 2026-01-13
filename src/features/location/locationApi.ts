import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";

interface State {
    stateId: number;
    stateName: string;
    country: string;
    isActive: boolean;
}

interface City {
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    isActive: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error: any;
    errors: any;
}

export const locationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // ======================
        // GET STATES
        // ======================
        getStates: builder.query<State[], void>({
            query: () => API_ROUTES.STATES,
            transformResponse: (res: ApiResponse<State[]>) => res.data,
            providesTags: ["State"],
        }),

        // ======================
        // GET CITIES
        // ======================
        getCities: builder.query<City[], number>({
            query: (stateId) => `${API_ROUTES.CITIES}/state/${stateId}`,
            transformResponse: (res: ApiResponse<City[]>) => res.data,
            providesTags: ["City"],
        }),
    }),
});

export const {
    useGetStatesQuery,
    useGetCitiesQuery,
} = locationApi;
