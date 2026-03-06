import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, InvoiceItem, CreateInvoiceItemDto } from "./invoiceitem.types";

export const invoiceItemApi = api.injectEndpoints({

  endpoints: (builder) => ({

    // ===============================
    // GET ALL INVOICE ITEMS
    // ===============================
    getInvoiceItems: builder.query<InvoiceItem[], void>({
      query: () => API_ROUTES.INVOICE_ITEMS,
      transformResponse: (res: ApiResponse<InvoiceItem[]>) => res.data,
      providesTags: ["InvoiceItems"],
    }),

    // ===============================
    // GET BY INVOICE ID
    // ===============================
    getInvoiceItemsByInvoiceId: builder.query<InvoiceItem[], number>({
      query: (invoiceId) =>
        `${API_ROUTES.INVOICE_ITEMS}?invoiceId=${invoiceId}`,
      transformResponse: (res: ApiResponse<InvoiceItem[]>) => res.data,
      providesTags: ["InvoiceItems"],
    }),

    // ===============================
    // CREATE
    // ===============================
    createInvoiceItem: builder.mutation<
      InvoiceItem,
      CreateInvoiceItemDto
    >({
      query: (body) => ({
        url: API_ROUTES.INVOICE_ITEMS,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<InvoiceItem>) => res.data,
      invalidatesTags: ["InvoiceItems"],
    }),

    // ===============================
    // DELETE
    // ===============================
    deleteInvoiceItem: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `${API_ROUTES.INVOICE_ITEMS}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: ApiResponse<any>) => res.success,
      invalidatesTags: ["InvoiceItems"],
    }),

  }),

});

export const {
  useGetInvoiceItemsQuery,
  useGetInvoiceItemsByInvoiceIdQuery,
  useCreateInvoiceItemMutation,
  useDeleteInvoiceItemMutation,
} = invoiceItemApi;