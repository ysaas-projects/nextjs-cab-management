"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { useCreateProductMutation } from "@/features/product/productApi";
import { productSchema } from "@/features/product/product.validation";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CreateProductPage() {
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();

    // ✅ Get logged-in firmId from auth store
    const firmId = useSelector((state: RootState) => state.auth.user?.firmId);

    const [form, setForm] = useState({
        productName: "",
        productGrade: "",
        stockQuantity: 0,
        status: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

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
            millId: firmId, // ✅ auto assigned
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
            const response = await createProduct(payload).unwrap();

            enqueueSnackbar("Product created successfully", {
                variant: "success",
            });

            router.push(`/products/${response.productId}`);
        } catch (error) {
            setFormError("Failed to create product.");
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Add New Product
                </h1>
                <p className="text-sm text-gray-500">
                    Product will be linked to your mill automatically
                </p>
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
                            isLoading={isLoading}
                            onClick={handleSave}
                        >
                            Save Product
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
