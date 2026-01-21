"use client";

import { useGetFirmTermsQuery } from "@/features/firmTerm/firmTermApi";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import FirmTermTable from "./table";

export default function FirmTermsPage() {
    const { data, isLoading, isError } = useGetFirmTermsQuery();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading firm terms.</div>;

    const transformed = (data ?? []).map((t, index) => ({
        id: t.firmTermId,
        srNo: index + 1,
        firmId: t.firmId,
        firmName: t.firmName ?? "-", // ✅ ADD THIS
        description: t.description,
        isActive: t.isActive,
    }));

    return (
        <>
            <PageBreadcrumb pageTitle="Manage Firm Terms" />

            <div className="space-y-6">
                <ComponentCard
                    title="Firm Terms List"
                    desc={`Total ${transformed.length} records found.`}
                    action={
                        <Link href="/firm-terms/create">
                            <Button variant="primary" size="sm">
                                + Add Firm Term
                            </Button>
                        </Link>
                    }
                >
                    <FirmTermTable data={transformed} />
                </ComponentCard>
            </div>
        </>
    );
}
