import { api } from "@/store/api";
import {
  Season,
  CreateSeasonRequest,
  UpdateSeasonRequest,
  ApiResponse,
} from "./season.types";

export const seasonApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ===============================
    // GET ALL SEASONS
    // ===============================
    getSeasons: builder.query<ApiResponse<Season[]>, void>({
      query: () => "/seasons",
      providesTags: ["Season"],
    }),

    // ===============================
    // GET BY ID
    // ===============================
    getSeasonById: builder.query<ApiResponse<Season>, number>({
      query: (id) => `/seasons/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Season", id }],
    }),

    // ===============================
    // CREATE
    // ===============================
    createSeason: builder.mutation<
      ApiResponse<Season>,
      CreateSeasonRequest
    >({
      query: (body) => ({
        url: "/seasons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Season"],
    }),

    // ===============================
    // UPDATE
    // ===============================
    updateSeason: builder.mutation<
      ApiResponse<boolean>,
      UpdateSeasonRequest
    >({
      query: ({ seasonId, ...body }) => ({
        url: `/seasons/${seasonId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Season", id: arg.seasonId },
      ],
    }),

    // ===============================
    // DELETE
    // ===============================
    deleteSeason: builder.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/seasons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Season"],
    }),
  }),
});

export const {
  useGetSeasonsQuery,
  useGetSeasonByIdQuery,
  useCreateSeasonMutation,
  useUpdateSeasonMutation,
  useDeleteSeasonMutation,
} = seasonApi;
