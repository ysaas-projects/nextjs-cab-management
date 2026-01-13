// src/features/order/orderApi.ts

import { api } from "@/store/api";
import {
    CreateOrderPayload,
    OrderResponse,
    InvoiceResponse,
    ApiResponse,
    PayNowResponse,
    PayNowPayload,
    PaymentDetailsResponse,
} from "./order.types";
import { API_ROUTES } from "@/lib/apiRoutes";

export const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // CREATE ORDER
        createOrder: builder.mutation<ApiResponse<OrderResponse>, CreateOrderPayload>({
            query: (payload) => ({
                url: `${API_ROUTES.ORDERS}/place-order`,
                method: "POST",
                body: payload,
            }),
        }),

        // GET INVOICE
        getInvoice: builder.query<ApiResponse<InvoiceResponse>, number>({
            query: (orderId) => `${API_ROUTES.ORDERS}/invoice/${orderId}`,
        }),


        //  Get invoices by Mill ID
        getInvoicesByMillId: builder.query<ApiResponse<InvoiceResponse[]>, number>({
            query: (millId) => ({
                url: `${API_ROUTES.ORDERS}/invoice/mill/${millId}`,
                method: "GET",
            }),
        }),

        //  Get invoices by Buyer ID
        getInvoicesByBuyerId: builder.query<ApiResponse<InvoiceResponse[]>, number>({
            query: (buyerId) => ({
                url: `${API_ROUTES.ORDERS}/invoice/company/${buyerId}`,
                method: "GET",
            }),
        }),

        // CREATE PAYMENT + ORDER (Pay Now)
        payNow: builder.mutation<ApiResponse<PayNowResponse>, PayNowPayload>({
            query: (payload) => ({
                url: `${API_ROUTES.ORDERS}/pay-now`,
                method: "POST",
                body: payload,
            }),
        }),

        // GET PAYMENT DETAILS BY ORDER ID
        getPaymentDetails: builder.query<
            ApiResponse<PaymentDetailsResponse>,
            number
        >({
            query: (buyerPurchaseId) => ({
                url: `${API_ROUTES.ORDERS}/payment-details/${buyerPurchaseId}`,
                method: "GET",
            }),
        }),



    }),
});

export const {
    useCreateOrderMutation,
    useGetInvoiceQuery,
    useGetInvoicesByMillIdQuery,
    useGetInvoicesByBuyerIdQuery,
    usePayNowMutation,
    useGetPaymentDetailsQuery,

} = orderApi;
