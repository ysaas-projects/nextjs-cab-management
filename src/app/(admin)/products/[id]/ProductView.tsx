"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
    useGetProductByIdQuery,
    useGetProductImagesQuery,
    useUploadProductImagesMutation,
    useDeleteProductImageMutation,
    useGetSellingPricesByProductQuery,
    useCreateSellingPriceMutation,
    useUpdateSellingPriceMutation,
} from "@/features/product/productApi";
import { useRouter } from "next/navigation";

type PreviewImage = {
    file: File;
    preview: string;
};

export default function ProductViewPage() {
    const params = useParams();
    const productId = Number(params.id);
    const { data: product, isLoading } = useGetProductByIdQuery(productId);
    const { data: images = [] } = useGetProductImagesQuery(productId);
    const [uploadImages, { isLoading: uploading }] =
        useUploadProductImagesMutation();
    const [deleteImage] = useDeleteProductImageMutation();
    const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);
    const { data: sellingPrices = [] } = useGetSellingPricesByProductQuery(productId);
    const [createSellingPrice] = useCreateSellingPriceMutation();
    const [updateSellingPrice] = useUpdateSellingPriceMutation();
    const currentPrice = sellingPrices[0]; // latest price
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [priceValue, setPriceValue] = useState<number | "">("");
    const router = useRouter();


    useEffect(() => {
        if (currentPrice) {
            setPriceValue(currentPrice.sellingPrice);
        }
    }, [currentPrice]);

    const MAX_IMAGES = 4;
    const canUploadMore = images.length < MAX_IMAGES;

    const handleSavePrice = async () => {
        if (priceValue === "" || priceValue < 0) return;

        if (currentPrice) {
            await updateSellingPrice({
                id: currentPrice.sellingPriceId,
                data: {
                    productId,
                    price: Number(priceValue),
                    status: true,
                },
            });
        } else {
            await createSellingPrice({
                productId,
                price: Number(priceValue),
                status: true,
            });
        }

        setIsEditingPrice(false);
    };


    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        setSelectedImages([
            {
                file,
                preview: URL.createObjectURL(file),
            },
        ]);
    };


    const handleUpload = async () => {
        if (selectedImages.length === 0) return;

        await uploadImages({
            productId,
            images: selectedImages.map((i) => i.file),
        });

        setSelectedImages([]);
    };

    const handleDelete = async (imageId: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmDelete) return;

        await deleteImage({ imageId, productId });
    };


    if (isLoading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Product Details</h1>

                <div className="flex gap-3">
                    {/* Back to List */}
                    <button
                        onClick={() => router.push("/products")}
                        className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        ← Product List
                    </button>

                    {/* Edit Product */}
                    <button
                        onClick={() => router.push(`/products/edit/${productId}`)}
                        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        ✏️ Edit Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* LEFT SIDE */}
                <div className="rounded-lg border bg-white p-6">
                    <InfoRow label="Product Name" value={product.productName} />
                    <InfoRow label="Grade" value={product.productGrade ?? "-"} />
                    <InfoRow label="Stock" value={product.stockQuantity} />
                    <InfoRow
                        label="Status"
                        value={product.status ? "Active" : "Inactive"}
                        badge
                    />
                    <div className="flex justify-between items-center border-b py-2">
                        <span className="text-gray-500">Price</span>

                        {!isEditingPrice ? (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {currentPrice?.sellingPrice ?? "N/A"}
                                </span>

                                <button
                                    onClick={() => setIsEditingPrice(true)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    ✏️
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={priceValue}
                                    onChange={(e) => setPriceValue(Number(e.target.value))}
                                    className="w-24 rounded border px-2 py-1 text-sm"
                                />

                                <button
                                    onClick={handleSavePrice}
                                    className="rounded bg-green-600 px-2 py-1 text-white text-sm"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => setIsEditingPrice(false)}
                                    className="text-sm text-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT SIDE - IMAGES */}
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                        Product Images
                    </h3>

                    {/* Existing Images */}
                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {images.map((img) => (
                                <div
                                    key={img.productImageId}
                                    className="relative rounded border overflow-hidden"
                                >
                                    <Image
                                        src={img.productImagePath}
                                        alt="product"
                                        width={300}
                                        height={200}
                                        className="h-40 w-full object-cover"
                                    />

                                    <button
                                        onClick={() =>
                                            handleDelete(img.productImageId)
                                        }
                                        className="absolute top-2 right-2 rounded bg-red-600 px-2 py-1 text-xs text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-4">
                            No images uploaded.
                        </p>
                    )}

                    {/* Upload Section */}
                    {canUploadMore ? (
                        <div className="border-t pt-4">
                            <label
                                htmlFor="image-upload"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org2000/svg"
                                    className="mb-2 h-8 w-8 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M7 16l-4 4m4-4l4 4m4-4l4 4"
                                    />
                                </svg>

                                <p className="text-sm font-medium text-gray-700">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, JPEG (Max 1 image at a time)
                                </p>

                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </label>

                            {selectedImages.length > 0 && (
                                <>
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        {selectedImages.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative h-24 overflow-hidden rounded border"
                                            >
                                                <Image
                                                    src={img.preview}
                                                    alt="preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {uploading ? "Uploading..." : "Upload Image"}
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-red-500">
                            Maximum of {MAX_IMAGES} images allowed.
                        </p>
                    )}


                </div>
            </div>
        </div>
    );
}

/* ======================
   SMALL COMPONENT
====================== */
function InfoRow({
    label,
    value,
    badge,
}: {
    label: string;
    value: string | number;
    badge?: boolean;
}) {
    return (
        <div className="flex justify-between border-b py-2">
            <span className="text-gray-500">{label}</span>
            {badge ? (
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                    {value}
                </span>
            ) : (
                <span className="font-medium">{value}</span>
            )}
        </div>
    );
}
