"use client";

// src/app/(admin)/order/payment/[buyerPurchaseId]/page.tsx

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
    useGetInvoiceQuery,
    usePayNowMutation
} from "@/features/order/orderApi";

import CustomInput from "@/components/atoms/CustomInput";
import Button from "@/components/atoms/Button";
import CustomSelect from "@/components/atoms/CustomSelect";

export default function PaymentPage() {

    const params = useParams();

    const buyerPurchaseId = Number(params.buyerPurchaseId); // 🔹 matches folder name

    const router = useRouter();

    const { data, isLoading } = useGetInvoiceQuery(buyerPurchaseId);

    const [payNow, { isLoading: paymentLoading }] =
        usePayNowMutation();

    const invoice = data?.data;

    const [paymentMethod, setPaymentMethod] = useState("");
    const [currency] = useState("INR");
    const [paymentRef, setPaymentRef] = useState("");

    useEffect(() => {
        setPaymentRef(`REF_${Date.now()}`);
    }, []);

    if (isLoading)
        return <div className="p-8 text-center">Loading invoice…</div>;

    if (!invoice)
        return (
            <div className="p-8 text-center text-red-600">
                Invoice not found
            </div>
        );

    const handlePayment = async () => {
        try {

            const payload = {
                buyerPurchaseId: invoice.buyerPurchaseId,

                productId: invoice.productId,
                productName: invoice.productName,
                millId: invoice.millId,
                buyerId: invoice.buyerId,

                orderQuantity: invoice.quantity,
                totalAmount: invoice.totalAmount,

                driverName: invoice.driverName,
                mobileNumber: invoice.buyerMobile,
                vehicleNumber: invoice.vehicleNumber,
                vehicleType: "Truck",

                paymentDate: new Date().toISOString(),
                paymentMethod,
                paymentStatus: "Paid",
                paymentReference: paymentRef,
                gatewayTransactionId: paymentRef
            };


            await payNow(payload).unwrap();

            alert("Payment Successful");

            router.push(`/order/invoice/${invoice.buyerPurchaseId}`);

        } catch (err: any) {
            alert(err?.data?.message ?? "Payment failed");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

                <h3 className="font-semibold mb-2">Order Summary</h3>

                <div className="border rounded-lg p-4 mb-6">

                    <div className="flex justify-between text-sm mb-2">
                        <span>Product</span>
                        <span className="font-medium">{invoice.productName}</span>
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                        <span>Quantity</span>
                        <span className="font-medium">{invoice.quantity}</span>
                    </div>

                    <hr className="my-2" />

                    <div className="flex justify-between text-lg font-semibold text-green-600">
                        <span>Total Amount</span>
                        <span>₹{invoice.totalAmount}</span>
                    </div>
                </div>

                <h3 className="font-semibold mb-2">Payment Method</h3>

                <CustomSelect
                    label="Payment Method"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    options={[
                        { id: "Cash", name: "Cash" },
                        { id: "Bank Transfer", name: "Bank Transfer" },
                        { id: "UPI", name: "UPI" },
                    ]}
                />

                <CustomInput
                    label="Currency"
                    name="currency"
                    value={currency}
                    disabled
                />

                <CustomInput
                    className="mt-3"
                    label="Payment Reference"
                    name="paymentRef"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                />

                <Button
                    className="w-full mt-6"
                    disabled={!paymentMethod || paymentLoading}
                    onClick={handlePayment}
                >
                    Pay ₹{invoice.totalAmount}
                </Button>
            </div>
        </div>
    );
}
