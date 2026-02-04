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
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((season) => ({
                type: "Season" as const,
                id: season.seasonId,
              })),
              { type: "Season", id: "LIST" },
            ]
          : [{ type: "Season", id: "LIST" }],
    }),

    // ===============================
    // GET SEASON BY ID
    // ===============================
    getSeasonById: builder.query<ApiResponse<Season>, number>({
      query: (id) => `/seasons/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Season", id },
      ],
    }),

    // ===============================
    // CREATE SEASON
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
      invalidatesTags: [
        { type: "Season", id: "LIST" },
      ],
    }),

    // ===============================
    // UPDATE SEASON
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
      invalidatesTags: (_result, _error, arg) => [
        { type: "Season", id: arg.seasonId }, // refresh detail
        { type: "Season", id: "LIST" },       // refresh list
      ],
    }),

    // ===============================
    // DELETE SEASON
    // ===============================
    deleteSeason: builder.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/seasons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Season", id: "LIST" },
      ],
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
