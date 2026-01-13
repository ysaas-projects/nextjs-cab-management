"use client";

import CustomInput from "@/components/atoms/CustomInput";
import Button from "@/components/atoms/Button";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

import {
    useGetProductByIdQuery,
    useUpdateProductMutation,
} from "@/features/product/productApi";
import { productSchema } from "@/features/product/product.validation";
import { RootState } from "@/store";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = Number(params.id);

    const { data: product, isLoading } = useGetProductByIdQuery(productId, {
        skip: !productId,
    });

    const [updateProduct, { isLoading: updating }] =
        useUpdateProductMutation();

    const firmId = useSelector((state: RootState) => state.auth.user?.firmId);

    const [form, setForm] = useState({
        productName: "",
        productGrade: "",
        stockQuantity: 0,
        status: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    // ----------------------------
    // Populate form when data loads
    // ----------------------------
    useEffect(() => {
        if (product) {
            setForm({
                productName: product.productName,
                productGrade: product.productGrade || "",
                stockQuantity: product.stockQuantity,
                status: product.status,
            });
        }
    }, [product]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "stockQuantity" ? Number(value) : value,
        }));
    };

    const handleSave = async () => {
        setErrors({});
        setFormError(null);

        if (!firmId) {
            setFormError("Firm not found. Please login again.");
            return;
        }

        const payload = {
            ...form,
            productId,
            millId: firmId,
        };

        const validation = productSchema.safeParse(payload);

        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0] as string] = issue.message;
            });

            setErrors(fieldErrors);
            setFormError("Please fix the errors below.");
            return;
        }

        try {
            await updateProduct(payload).unwrap();

            enqueueSnackbar("Product updated successfully", {
                variant: "success",
            });

            router.push(`/products/${productId}`);
        } catch (error) {
            setFormError("Failed to update product.");
        }
    };

    if (isLoading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading product details...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Edit Product
                    </h1>
                    <p className="text-sm text-gray-500">
                        Update product information
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* Back to Product List */}
                    <button
                        onClick={() => router.push("/products")}
                        className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        ← Product List
                    </button>

                    {/* View Product */}
                    <button
                        onClick={() => router.push(`/products/${productId}`)}
                        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        View Product
                    </button>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="space-y-10 p-6">

                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    {/* PRODUCT DETAILS */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
                            Product Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput
                                label="Product Name"
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                error={errors.productName}
                            />

                            <CustomInput
                                label="Product Grade"
                                name="productGrade"
                                value={form.productGrade}
                                onChange={handleChange}
                                error={errors.productGrade}
                            />
                        </div>
                    </section>

                    {/* STOCK */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
                            Inventory
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput
                                label="Stock Quantity"
                                name="stockQuantity"
                                type="number"
                                value={String(form.stockQuantity)}
                                onChange={handleChange}
                                error={errors.stockQuantity}
                            />
                        </div>
                    </section>

                    {/* STATUS */}
                    <section>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
                            Status
                        </h3>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.status}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        status: e.target.checked,
                                    }))
                                }
                            />
                            Active
                        </label>
                    </section>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button variant="default" onClick={() => router.back()}>
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            isLoading={updating}
                            onClick={handleSave}
                        >
                            Update Product
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
