"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import { useGetFirmSpeedPoliciesQuery } from "@/features/firmSpeedPolicy/firmSpeedPolicy.api";
import FirmSpeedPolicyTable from "./table";

export default function FirmSpeedPoliciesPage() {
    const { data, isLoading, isError } = useGetFirmSpeedPoliciesQuery();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading speed policies.</div>;

    const policies = data ?? [];

    return (
        <>
            <PageBreadcrumb pageTitle="Firm Speed Policies" />

            <ComponentCard
                title="Speed Policy History"
                desc="Only one policy can be active at a time. Creating a new policy will deactivate the previous one."
                action={
                    <Link href="/settings/firm-speed-policies/create">
                        <Button variant="primary" size="sm">
                            + New Speed Policy
                        </Button>
                    </Link>
                }
            >
                <FirmSpeedPolicyTable data={policies} />
            </ComponentCard>
        </>
    );
}