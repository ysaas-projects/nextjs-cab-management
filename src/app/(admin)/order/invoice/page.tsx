"use client";

// src/app/(admin)/order/invoice/page.tsx

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    useGetInvoicesByMillIdQuery,
    useGetInvoicesByBuyerIdQuery,
} from "@/features/order/orderApi";
import Button from "@/components/atoms/Button";

export default function InvoicesPage() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    const firmId = user?.firmId;
    const role = user?.role; // "Mill" | "Buyer"


    useEffect(() => {
        console.log("User Info:", user);
    }, [user]);
    
    // ✅ Fetch based on role
    const {
        data,
        isLoading,
        isError,
    } =
        role === "Mill-Admin"
            ? useGetInvoicesByMillIdQuery(firmId!, { skip: !firmId })
            : useGetInvoicesByBuyerIdQuery(firmId!, { skip: !firmId });

    useEffect(() => {
        if (!firmId) router.push("/login");
    }, [firmId, router]);

    if (!firmId) return null;
    if (isLoading) return <p className="p-6">Loading invoices...</p>;
    if (isError || !data) return <p className="p-6">Failed to load invoices</p>;

    const invoices = Array.isArray(data?.data) ? data.data : [];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
                Invoices — <span className="text-blue-600">{user?.username}</span>
            </h2>

            <div className="bg-white shadow border rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left text-gray-600">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Grade</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Buyer</th>
                            <th className="px-4 py-3">Mill</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                                    {data?.message ?? "No invoices found"}
                                </td>
                            </tr>
                        ) : (
                            invoices.map((invoice, index) => (
                                <tr key={invoice.buyerPurchaseId} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{invoice.productName}</td>
                                    <td className="px-4 py-3">{invoice.productGrade}</td>
                                    <td className="px-4 py-3">{invoice.quantity}</td>
                                    <td className="px-4 py-3">₹{invoice.totalAmount}</td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium
                      ${invoice.orderStatus === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : invoice.orderStatus === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {invoice.orderStatus}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">{invoice.buyerName}</td>
                                    <td className="px-4 py-3">{invoice.millName}</td>

                                    <td className="px-4 py-3">
                                        {invoice.paymentStatus ? (
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full
                        ${invoice.paymentStatus === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {invoice.paymentStatus}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => router.push(`/order/invoice/${invoice.buyerPurchaseId}`)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                            >
                                                Invoice
                                            </Button>

                                            {invoice.orderStatus === "Paid" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        router.push(`/order/payment/${invoice.buyerPurchaseId}/slip/${invoice.paymentId}`)
                                                    }
                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                >
                                                    Pay Slip
                                                </Button>
                                            )}
                                        </div>
                                    </td>

                                </tr>

                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
