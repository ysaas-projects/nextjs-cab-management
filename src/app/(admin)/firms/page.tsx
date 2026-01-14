"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";

import { useGetPaginatedFirmsQuery } from "@/features/firm/firmApi";
import { Firm } from "@/features/firm/firm.types";
import FirmTable from "./table";

export default function Firms() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, isLoading, isError } = useGetPaginatedFirmsQuery({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading firms.</div>;

    const firms: Firm[] = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalCount = data?.totalCount ?? 0;

    const transformed = firms.map((f) => ({
        id: f.firmId,
        firmName: f.firmName,
        firmCode: f.firmCode,
        isActive: f.isActive,
    }));

    return (
        <>
            <PageBreadcrumb pageTitle="Manage Firms" />

            <div className="space-y-6">
                <ComponentCard
                    title="Firm List"
                    desc={`Total ${totalCount} records found.`}
                    action={
                        <Link href="/firms/create">
                            <Button variant="primary" size="sm">
                                + Add Firm
                            </Button>
                        </Link>
                    }
                >
                    <FirmTable data={transformed} />

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
