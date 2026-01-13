"use client";

import Image from "next/image";
import { useGetProductsQuery } from "@/features/product/productApi";
import { useRouter } from "next/navigation";

export default function ProductListPage() {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const router = useRouter();

    const handleBuyNow = (productId: number) => {
        router.push(`/products/buy/${productId}`);
    };

    if (isLoading) {
        return <div className="p-10 text-center">Loading products...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-3xl font-semibold text-gray-800">
                    Our Products
                </h1>

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                    {products.map((product) => {
                        const image =
                            product.images?.[0]?.productImagePath ||
                            "/images/no-image.png";

                        return (
                            <div
                                key={product.productId}
                                className="rounded-2xl bg-white shadow-md hover:shadow-xl transition"
                            >
                                <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
                                    <Image
                                        src={image}
                                        alt={product.productName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold">
                                        {product.productName}
                                    </h3>

                                    <p className="text-sm text-gray-600">
                                        Grade: {product.productGrade ?? "-"}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-blue-600">
                                        Selling Price:{" "}
                                        {product.sellingPrice
                                            ? `₹${product.sellingPrice}`
                                            : "Not Available"}
                                    </p>

                                    <button
                                        onClick={() => handleBuyNow(product.productId)}
                                        className="mt-4 w-full rounded-lg bg-green-500 py-2 text-white font-semibold hover:bg-green-600"
                                    >
                                        BUY NOW
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
