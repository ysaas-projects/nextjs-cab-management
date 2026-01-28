import { api } from "@/store/api";
import type {
  ApiResponse,
  CabNumberDirectory,
  CreateCabNumberPayload,
  UpdateCabNumberPayload,
  PaginatedCabNumberDirectory,
} from "./cabnumberdirectory.types";

export const cabnumberdirectoryApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // GET ALL CAB NUMBERS (FLAT LIST)
    // ===============================
    getCabNumberDirectory: builder.query<
      ApiResponse<CabNumberDirectory[]>,
      void
    >({
      query: () => ({
        url: "/CabNumberDirectory",
        method: "GET",
      }),
      providesTags: ["CabNumberDirectory"],
    }),

    // ===============================
    // GET CAB-WISE CAB NUMBERS (JOIN)
    // ===============================
    getCabWiseCabNumbers: builder.query<
      ApiResponse<{
        cabId: number;
        cabType: string;
        cabNumbers: {
          cabNumberDirectoryId: number;
          cabNumber: string;
          isActive: boolean;
        }[];
      }[]>,
      void
    >({
      query: () => ({
        url: "/CabNumberDirectory/by-cab",
        method: "GET",
      }),
      providesTags: ["CabNumberDirectory"],
    }),

    // ===============================
    // GET PAGINATED
    // ===============================
    getCabNumberDirectoryPaginated: builder.query<
      ApiResponse<PaginatedCabNumberDirectory>,
      {
        pageNumber?: number;
        pageSize?: number;
        search?: string;
        isActive?: boolean;
      }
    >({
      query: (params) => ({
        url: "/CabNumberDirectory/paginated",
        method: "GET",
        params,
      }),
      providesTags: ["CabNumberDirectory"],
    }),

    // ===============================
    // GET BY ID
    // ===============================
    getCabNumberDirectoryById: builder.query<
      ApiResponse<CabNumberDirectory>,
      number
    >({
      query: (id) => ({
        url: `/CabNumberDirectory/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "CabNumberDirectory", id },
      ],
    }),

    // ===============================
    // CREATE
    // ===============================
    createCabNumberDirectory: builder.mutation<
      ApiResponse<{ cabNumberDirectoryId: number }>,
      CreateCabNumberPayload
    >({
      query: (body) => ({
        url: "/CabNumberDirectory",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CabNumberDirectory"],
    }),

    // ===============================
    // UPDATE
    // ===============================
    updateCabNumberDirectory: builder.mutation<
      ApiResponse<null>,
      UpdateCabNumberPayload
    >({
      query: ({ cabNumberDirectoryId, ...body }) => ({
        url: `/CabNumberDirectory/${cabNumberDirectoryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "CabNumberDirectory", id: arg.cabNumberDirectoryId },
      ],
    }),

    // ===============================
    // DELETE (SOFT DELETE)
    // ===============================
    deleteCabNumberDirectory: builder.mutation<
      ApiResponse<null>,
      number
    >({
      query: (id) => ({
        url: `/CabNumberDirectory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CabNumberDirectory"],
    }),
  }),

  overrideExisting: false,
});

// ===============================
// EXPORT HOOKS
// ===============================
export const {
  useGetCabNumberDirectoryQuery,
  useGetCabWiseCabNumbersQuery,      // ✅ JOIN API HOOK
  useGetCabNumberDirectoryPaginatedQuery,
  useGetCabNumberDirectoryByIdQuery,
  useCreateCabNumberDirectoryMutation,
  useUpdateCabNumberDirectoryMutation,
  useDeleteCabNumberDirectoryMutation,
} = cabnumberdirectoryApi;
