"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";

import StateTable from "./table";
import { useGetPaginatedStatesQuery } from "@/features/states/stateApi";
import { State } from "@/features/states/state.types";

export default function StatesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, isLoading, isError } = useGetPaginatedStatesQuery({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading states.</div>;

    // ✅ CRITICAL: ALWAYS DEFAULT TO ARRAY
    const states: State[] = data?.data ?? [];

    const transformedData = states.map((state) => ({
        id: state.stateId,
        stateName: state.stateName,
        country: state.country,
    }));

    return (
        <>
            <PageBreadcrumb pageTitle="Manage States" />

            <div className="space-y-6">
                <ComponentCard
                    title="State List"
                    desc={`Total ${data?.totalCount ?? 0} records found.`}
                    action={
                        <Link href="/settings/states/create">
                            <Button variant="primary" size="sm">
                                + Add State
                            </Button>
                        </Link>
                    }
                >
                    {/* ✅ NEVER PASS UNDEFINED */}
                    <StateTable data={transformedData} />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={setCurrentPage}
                    />
                </ComponentCard>
            </div>
        </>
    );
}
