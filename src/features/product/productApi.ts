import { api } from "@/store/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
    Product,
    PaginatedProductResponse,
    ApiResponse,
    ProductImage,

    SellingPriceDto,
    SellingPriceResponse,
    SellingPriceListResponse,
    SellingPriceActionResponse,
    UpdateSellingPricePayload,    
} from "./product.types";

export const productApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ======================================================
        // PRODUCTS
        // ======================================================

        getProducts: builder.query<Product[], void>({
            query: () => API_ROUTES.PRODUCTS,
            transformResponse: (response: ApiResponse<Product[]>) => response.data,
            providesTags: ["Product"],
        }),

        getPaginatedProducts: builder.query<
            PaginatedProductResponse,
            { pageNumber: number; pageSize: number }
        >({
            query: ({ pageNumber, pageSize }) =>
                `${API_ROUTES.PRODUCTS}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            transformResponse: (res: ApiResponse<PaginatedProductResponse>) => res.data,
            providesTags: ["Product"],
        }),

        getProductById: builder.query<Product, number>({
            query: (id) => `${API_ROUTES.PRODUCTS}/${id}`,
            transformResponse: (res: ApiResponse<Product>) => res.data,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),

        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (payload) => ({
                url: API_ROUTES.PRODUCTS,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<Product>) => res.data,
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation<Product, Partial<Product>>({
            query: (payload) => ({
                url: `${API_ROUTES.PRODUCTS}/${payload.productId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (res: ApiResponse<Product>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "Product", id: result.productId }] : ["Product"],
        }),

        updateProductStatus: builder.mutation<
            Product,
            { productId: number; status: boolean }
        >({
            query: ({ productId, status }) => ({
                url: `${API_ROUTES.PRODUCTS}/UpdateProductStatus/${productId}/${status ? 1 : 0}`,
                method: "PUT",
            }),
            transformResponse: (res: ApiResponse<Product>) => res.data,
            invalidatesTags: (result) =>
                result ? [{ type: "Product", id: result.productId }] : ["Product"],
        }),

        // ======================================================
        // PRODUCT IMAGES
        // ======================================================

        getProductImages: builder.query<ProductImage[], number>({
            query: (productId) =>
                `${API_ROUTES.PRODUCT_IMAGES}/${productId}/images`,
            transformResponse: (res: ApiResponse<ProductImage[]>) => res.data,
            providesTags: (result, error, productId) => [
                { type: "ProductImage", id: productId },
            ],
        }),

        uploadProductImages: builder.mutation<
            boolean,
            { productId: number; images: File[] }
        >({
            query: ({ productId, images }) => {
                const formData = new FormData();
                images.forEach((img) => formData.append("images", img));

                return {
                    url: `${API_ROUTES.PRODUCT_IMAGES}/${productId}/upload-images`,
                    method: "POST",
                    body: formData,
                };
            },
            transformResponse: (res: ApiResponse<any>) => res.success,
            invalidatesTags: (result, error, { productId }) => [
                { type: "ProductImage", id: productId },
            ],
        }),

        deleteProductImage: builder.mutation<
            boolean,
            { imageId: number; productId: number }
        >({
            query: ({ imageId }) => ({
                url: `${API_ROUTES.PRODUCT_IMAGES}/delete-image/${imageId}`,
                method: "DELETE",
            }),
            transformResponse: (res: ApiResponse<any>) => res.success,
            invalidatesTags: (result, error, { productId }) => [
                { type: "ProductImage", id: productId },
            ],
        }),

        toggleProductImageStatus: builder.mutation<
            boolean,
            { imageId: number; productId: number }
        >({
            query: ({ imageId }) => ({
                url: `${API_ROUTES.PRODUCT_IMAGES}/toggle-image-status/${imageId}`,
                method: "PUT",
            }),
            transformResponse: (res: ApiResponse<any>) => res.success,
            invalidatesTags: (result, error, { productId }) => [
                { type: "ProductImage", id: productId },
            ],
        }),


        // ======================================================
        // SELLING PRICES
        // ======================================================

        getSellingPrices: builder.query<SellingPriceDto[], void>({
            query: () => API_ROUTES.SELLING_PRICES,
            transformResponse: (res: SellingPriceListResponse) => res.data,
            providesTags: ["SellingPrice"],
        }),

        getSellingPricesByProduct: builder.query<SellingPriceDto[], number>({
            query: (productId) =>
                `${API_ROUTES.SELLING_PRICES}/product/${productId}`,
            transformResponse: (res: SellingPriceListResponse) => res.data,
            providesTags: (result, error, productId) => [
                { type: "SellingPrice", id: productId },
            ],
        }),

        createSellingPrice: builder.mutation<
            SellingPriceResponse,
            UpdateSellingPricePayload
        >({
            query: (payload) => ({
                url: API_ROUTES.SELLING_PRICES,
                method: "POST",
                body: payload,
            }),
            transformResponse: (res: SellingPriceActionResponse) => {
                if (!res.data) {
                    throw new Error("Invalid selling price response");
                }
                return res.data;
            },

            invalidatesTags: ["SellingPrice"],
        }),

        updateSellingPrice: builder.mutation<
            SellingPriceResponse,
            { id: number; data: UpdateSellingPricePayload }
        >({
            query: ({ id, data }) => ({
                url: `${API_ROUTES.SELLING_PRICES}/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (res: SellingPriceActionResponse) => {
                if (!res.data) {
                    throw new Error("Invalid selling price response");
                }
                return res.data;
            },

            invalidatesTags: ["SellingPrice"],
        }),

        deleteSellingPrice: builder.mutation<
            boolean,
            number
        >({
            query: (id) => ({
                url: `${API_ROUTES.SELLING_PRICES}/${id}`,
                method: "DELETE",
            }),
            transformResponse: (res: ApiResponse<any>) => res.success,
            invalidatesTags: ["SellingPrice"],
        }),


    }),
});

// ✅ EXPORT HOOKS (VERY IMPORTANT)
export const {
    useGetProductsQuery,
    useGetPaginatedProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUpdateProductStatusMutation,

    useGetProductImagesQuery,
    useUploadProductImagesMutation,
    useDeleteProductImageMutation,
    useToggleProductImageStatusMutation,

    // 🔹 SELLING PRICE HOOKS
    useGetSellingPricesQuery,
    useGetSellingPricesByProductQuery,
    useCreateSellingPriceMutation,
    useUpdateSellingPriceMutation,
    useDeleteSellingPriceMutation,    
} = productApi;
