import { z } from "zod";

export const productSchema = z.object({
    productName: z
        .string()
        .min(2, "Product name is required")
        .max(255, "Product name must be less than 255 characters"),

    productGrade: z
        .string()
        .max(100, "Product grade must be less than 100 characters")
        .optional(),

    millId: z
        .number()
        .min(1, "Mill is required"),

    stockQuantity: z
        .number()
        .min(0, "Stock quantity must be 0 or greater"),

    status: z.boolean(),
});


// =======================
// PRODUCT IMAGE SCHEMA
// =======================

export const productImageSchema = z.object({
    productId: z
        .number()
        .min(1, "Product is required"),

    productImagePath: z
        .string()
        .min(1, "Image path is required")
        .max(255, "Image path must be less than 255 characters"),

    status: z.boolean().optional(),
});

export const productImageUploadSchema = z.object({
    productId: z.number().min(1, "Product is required"),
    images: z
        .any()
        .refine((files) => files?.length > 0, "At least one image is required"),
});


// =======================
// ADD / UPDATE SELLING PRICE
// =======================

export const addSellingPriceSchema = z.object({
    productId: z
        .number()
        .min(1, "Product is required"),

    price: z
        .number()
        .min(0, "Price must be 0 or greater"),

    status: z.boolean(),
});


export const updateSellingPriceSchema = z.object({
    productId: z
        .number()
        .min(1, "Product is required"),

    price: z
        .number()
        .min(0, "Price must be 0 or greater"),

    status: z.boolean(),
});



// =======================
// TYPE
// =======================


export type ProductFormValues = z.infer<typeof productSchema>;

export type ProductImageFormValues = z.infer<typeof productImageSchema>;

export type AddSellingPriceFormValues = z.infer<typeof addSellingPriceSchema>;
export type UpdateSellingPriceFormValues = z.infer<typeof updateSellingPriceSchema>;
