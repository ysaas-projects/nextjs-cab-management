"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useGetProductByIdQuery } from "@/features/product/productApi";
import { useCreateOrderMutation } from "@/features/order/orderApi";
import CustomInput from "@/components/atoms/CustomInput";
import Button from "@/components/atoms/Button";

export default function BuyPage() {
    const { id } = useParams();
    const router = useRouter();

    // ✅ Product API
    const { data: product, isLoading: productLoading } =
        useGetProductByIdQuery(Number(id));

    // ✅ Order API
    const [createOrder, { isLoading: orderLoading }] =
        useCreateOrderMutation();

    // FORM STATE
    const [quantity, setQuantity] = useState("");
    const [driverName, setDriverName] = useState("");
    const [mobile, setMobile] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");

    // TEMP: Replace with logged-in user id
    const buyerId = 1;

    const basePrice = Number(product?.sellingPrice ?? 0);
    const totalPrice = Number(quantity || 0) * basePrice;

    const handleOrder = async (type: "pay" | "invoice") => {
        try {
            const payload = {
                productId: Number(id),
                buyerId,
                orderQuantity: Number(quantity),
                totalAmount: totalPrice,
                status: "Pending",

                driverName,
                mobileNumber: mobile,
                vehicleNumber,
                vehicleType,
            };

            const response = await createOrder(payload).unwrap();

            const orderId = response.data.buyerPurchaseId;

            if (type === "pay") {
                router.push(`/order/payment/${orderId}`);
            } else {
                router.push(`/order/invoice/${orderId}`);
            }

        } catch (error: any) {
            console.error("Order failed:", error);
            alert(error?.data?.message || "Failed to place order");
        }
    };

    if (productLoading) {
        return <div className="p-10 text-center">Loading product...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

                {/* PRODUCT DETAILS */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-green-700">
                            {product?.productName}
                        </h2>

                        <p className="text-sm mt-1">
                            Grade: <span className="font-medium">{product?.productGrade}</span>
                        </p>

                        <div className="mt-4 w-40">
                            <CustomInput
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm">
                            Base Price: <span className="font-medium">₹{basePrice}</span>
                        </p>

                        <p className="text-sm mt-2">
                            Total Price:{" "}
                            <span className="font-semibold">₹{totalPrice}</span>
                        </p>
                    </div>
                </div>

                {/* DRIVER DETAILS */}
                <h3 className="text-red-600 font-semibold mt-8 mb-4">
                    Driver & Vehicle Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                        label="Driver Name"
                        value={driverName}
                        name="driverName"
                        onChange={(e) => setDriverName(e.target.value)}
                    />

                    <CustomInput
                        label="Mobile Number"
                        value={mobile}
                        name="mobile"
                        onChange={(e) => setMobile(e.target.value)}
                    />

                    <CustomInput
                        label="Vehicle Type"
                        value={vehicleType}
                        name="vehicleType"
                        onChange={(e) => setVehicleType(e.target.value)}
                    />

                    <CustomInput
                        label="Vehicle Number"
                        value={vehicleNumber}
                        name="vehicleNumber"
                        onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end mt-6 gap-3">
                    <Button
                        variant="secondary"
                        disabled={!quantity || orderLoading}
                        onClick={() => handleOrder("invoice")}
                    >
                        Get Invoice Only
                    </Button>

                    <Button
                        variant="primary"
                        disabled={!quantity || orderLoading}
                        onClick={() => handleOrder("pay")}
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
