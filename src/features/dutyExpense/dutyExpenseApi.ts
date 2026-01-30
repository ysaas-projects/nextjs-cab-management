// src/features/dutyexpense/dutyexpenseApi.ts

import { api } from "@/store/api";
import {
    ApiResponse,
    DutyExpense,
    CreateDutyExpenseRequest,
    UpdateDutyExpenseRequest,
} from "./dutyExpense.types";

export const dutyExpenseApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ===============================
        // GET ALL DUTY EXPENSES
        // ===============================
        getDutyExpenses: builder.query<
            DutyExpense[],
            void
        >({
            query: () => "/DutyExpense",
            transformResponse: (
                res: ApiResponse<DutyExpense[]>
            ) => res.data,
            providesTags: ["DutyExpense"],
        }),

        // ===============================
        // GET DUTY EXPENSE BY ID
        // ===============================
        getDutyExpenseById: builder.query<
            DutyExpense,
            number
        >({
            query: (id) => `/DutyExpense/${id}`,
            transformResponse: (
                res: ApiResponse<DutyExpense>
            ) => res.data,
            providesTags: (_r, _e, id) => [
                { type: "DutyExpense", id },
            ],
        }),

        // ===============================
        // CREATE DUTY EXPENSE
        // ===============================
        createDutyExpense: builder.mutation<
            DutyExpense,
            CreateDutyExpenseRequest
        >({
            query: (body) => ({
                url: "/DutyExpense",
                method: "POST",
                body,
            }),
            transformResponse: (
                res: ApiResponse<DutyExpense>
            ) => res.data,
            invalidatesTags: ["DutyExpense", "DutySlip"],
        }),

        // ===============================
        // UPDATE DUTY EXPENSE
        // ===============================
        updateDutyExpense: builder.mutation<
            void,
            { id: number; body: UpdateDutyExpenseRequest }
        >({
            query: ({ id, body }) => ({
                url: `/DutyExpense/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_r, _e, arg) => [
                { type: "DutyExpense", id: arg.id },
            ],
        }),

        // ===============================
        // DELETE DUTY EXPENSE (SOFT)
        // ===============================
        deleteDutyExpense: builder.mutation<
            void,
            number
        >({
            query: (id) => ({
                url: `/DutyExpense/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DutyExpense"],
        }),
    }),
});

export const {
    useGetDutyExpensesQuery,
    useGetDutyExpenseByIdQuery,
    useCreateDutyExpenseMutation,
    useUpdateDutyExpenseMutation,
    useDeleteDutyExpenseMutation,
} = dutyExpenseApi;
