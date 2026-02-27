"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import { useGetTimeSegmentsQuery } from "@/features/timeSegment/timeSegment.api";
import TimeSegmentTable from "./table";

export default function TimeSegmentsPage() {
    const { data, isLoading, isError } = useGetTimeSegmentsQuery();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading time segments.</div>;

    const segments = data ?? [];

    return (
        <>
            <PageBreadcrumb pageTitle="Time Segments" />

            <ComponentCard
                title="Time Segments Configuration"
                desc="Define day and night driving time boundaries."
                action={
                    <Link href="/settings/time-segments/create">
                        <Button variant="primary" size="sm">
                            + Add Segment
                        </Button>
                    </Link>
                }
            >
                <TimeSegmentTable data={segments} />
            </ComponentCard>
        </>
    );
}