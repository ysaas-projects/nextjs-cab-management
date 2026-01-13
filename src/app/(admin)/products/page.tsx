"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useGetPaginatedProductsQuery } from "@/features/product/productApi";
import { Product } from "@/features/product/product.types";
import ProductTable from "./table";

export default function ProductsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, isLoading, isError } = useGetPaginatedProductsQuery({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load products</div>;

    const products: Product[] = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalCount = data?.totalCount ?? 0;

    return (
        <>
            <PageBreadcrumb pageTitle="Products Management" />

            <div className="space-y-6">
                <ComponentCard
                    title="Products Management"
                    desc={`Total ${totalCount} products found.`}
                    action={
                        <Link href="/products/create">
                            <Button size="sm" variant="primary">
                                + Add Product
                            </Button>
                        </Link>
                    }
                >
                    <ProductTable data={products} />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </ComponentCard>
            </div>
        </>
    );
}
