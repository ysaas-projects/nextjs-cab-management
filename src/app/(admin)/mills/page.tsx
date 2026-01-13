"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import MillTable from "./table";
import { useGetPaginatedMillsQuery } from "@/features/mill/millApi";
import { Mill } from "@/features/mill/mill.types";

export default function Mills() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, isLoading, isError } = useGetPaginatedMillsQuery({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading mills.</div>;

    // ✅ Correct access
    const mills: Mill[] = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalCount = data?.totalCount ?? 0;

    const transformedData = mills.map((mill) => ({
        id: mill.millId,
        millName: mill.millName,
        location: mill.address,
        contactPerson: mill.contactPerson,
    }));

    return (
        <>
            <PageBreadcrumb pageTitle="Manage Mills" />

            <div className="space-y-6">
                <ComponentCard
                    title="Mill List"
                    desc={`Total ${totalCount} records found.`}
                    action={
                        <Link href="/mills/create">
                            <Button variant="primary" size="sm">
                                + Add Mill
                            </Button>
                        </Link>
                    }
                >
                    {/* add dynamic data */}
                    <MillTable data={transformedData} />

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
