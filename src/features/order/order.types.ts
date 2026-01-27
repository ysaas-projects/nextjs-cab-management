// src/features/order/order.types.ts

export interface CreateOrderPayload {
    productId: number;
    buyerId: number;
    orderQuantity: number;
    totalAmount: number;
    status: string;

    driverName?: string;
    MobileNumber?: string;
    vehicleNumber?: string;
    vehicleType?: string;
}

export interface OrderResponse {
    buyerPurchaseId: number;
    productId: number;
    orderQuantity: number;
    totalAmount: number;
    status: string;
}

export interface InvoiceResponse {
    paymentId: number;
    amount: number;
    paymentMethod: string | null;
    paymentStatus: string | null;
    paymentReference: string | null;
    gatewayTransactionId: string | null;
    paymentDate: string | null;
    isVerified: boolean;

    buyerPurchaseId: number;
    productId: number;
    productName: string;
    productGrade: string;
    quantity: number;
    totalAmount: number;
    orderStatus: string;
    purchaseOrderNumber: string;
    purchaseOrderDate: string;

    buyerId: number;
    buyerName: string;
    buyerMobile: string;
    buyerGSTNumber: string;
    buyerPANNumber: string;
    buyerFullAddress: string;

    millId: number;
    millName: string;
    millGSTNumber: string;
    millPANNumber: string | null;
    millFullAddress: string;

    driverName: string | null;
    vehicleNumber: string | null;
}

// PAY-NOW Request (Frontend → API)
export interface PayNowPayload {
    productId: number;
    millId: number;
    orderQuantity: number;
    totalAmount: number;

    paymentMethod: string;
    gatewayTransactionId?: string;
    paymentDate?: string;
}

// PAY-NOW Response (Backend → Frontend)
export interface PayNowResponse {
    buyerPurchaseId: number;
    paymentId: number;

    paymentStatus: string;
    paymentReference: string;

    productName: string;
}

export interface PaymentDetailsResponse {
    buyerPurchaseId: number;

    // ORDER
    productId: number;
    productName: string;
    quantity: number;
    totalAmount: number;
    orderStatus: string;
    orderDate: string;

    // DELIVERY
    driverName: string;
    MobileNumber: string;
    vehicleNumber: string;
    vehicleType: string | null;

    // PAYMENT
    paymentId: number;
    paymentStatus: string;
    paymentMethod: string | null;
    paymentReference: string | null;
    gatewayTransactionId: string | null;
    paymentDate: string | null;
    amountPaid: number;

    isVerified: boolean;
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
    errors?: any;
}
