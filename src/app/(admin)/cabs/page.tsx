// cabs/page.tsx
"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import CabTable from "./table";

import { useGetPaginatedCabsQuery } from "@/features/cab/cabApi";
import { Cab } from "@/features/cab/cab.types";

export default function Cabs() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, isLoading, isError } = useGetPaginatedCabsQuery({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    }, {
    refetchOnMountOrArgChange: true, 
  });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading cabs.</div>;

    // ✅ backend-driven pagination
    const cabs: Cab[] = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalCount = data?.totalCount ?? 0;

    const transformedData = cabs.map((cab) => ({
        id: cab.cabId,
        cabType: cab.cabType,
        firmName: (cab as any).firmName ?? "—",
        isActive: cab.isActive,
    }));

    return (
        <>
            <PageBreadcrumb pageTitle="Manage Cabs" />

            <div className="space-y-6">
                <ComponentCard
                    title="Cab List"
                    desc={`Total ${totalCount} records found.`}
                    action={
                        <Link href="/cabs/create">
                            <Button variant="primary" size="sm">
                                + Add Cab
                            </Button>
                        </Link>
                    }
                >
                    <CabTable data={transformedData} />

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
