import { api } from "@/store/api";
import {
  TourPackage,
  CreateTourPackageRequest,
  UpdateTourPackageRequest,
  ApiResponse,
} from "./tourpackage.types";

export const tourPackageApi = api.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ===============================
    // GET ALL TOUR PACKAGES
    // ===============================
    getTourPackages: builder.query<ApiResponse<TourPackage[]>, void>({
      query: () => "/tourpackages",
      providesTags: ["TourPackage"],
    }),

    // ===============================
    // GET BY ID
    // ===============================
    getTourPackageById: builder.query<ApiResponse<TourPackage>, number>({
      query: (id) => `/tourpackages/${id}`,
      providesTags: (_r, _e, id) => [{ type: "TourPackage", id }],
    }),

    // ===============================
    // CREATE
    // ===============================
    createTourPackage: builder.mutation<
      ApiResponse<TourPackage>,
      CreateTourPackageRequest
    >({
      query: (body) => ({
        url: "/tourpackages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TourPackage"],
    }),

    // ===============================
    // UPDATE
    // ===============================
    updateTourPackage: builder.mutation<
      ApiResponse<TourPackage>,
      UpdateTourPackageRequest
    >({
      query: ({ tourPackageId, ...body }) => ({
        url: `/tourpackages/${tourPackageId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "TourPackage", id: arg.tourPackageId },
      ],
    }),

    // ===============================
    // DELETE
    // ===============================
    deleteTourPackage: builder.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/tourpackages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TourPackage"],
    }),
  }),
});

export const {
  useGetTourPackagesQuery,
  useGetTourPackageByIdQuery,
  useCreateTourPackageMutation,
  useUpdateTourPackageMutation,
  useDeleteTourPackageMutation,
} = tourPackageApi;
