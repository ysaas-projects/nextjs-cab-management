"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";
import { useGetFirmByIdQuery } from "@/features/firm/firmApi";

type Props = {
    firmId: number;
};

export default function FirmProfileView({ firmId }: Props) {
    const { data, isLoading, isError } = useGetFirmByIdQuery(firmId);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Firm not found.</div>;

    const firmDetails = (data as any).firmDetails;

    return (
        <>
            <PageBreadcrumb pageTitle="Firm Details" />

            <div className="space-y-6">
                {/* ================= Firm Info ================= */}
                <ComponentCard
                    title="Firm Information"
                    action={
                        <Link href="/firms">
                            <Button variant="primary" size="sm">
                                Back
                            </Button>
                        </Link>
                    }
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InfoItem label="Firm Name" value={data.firmName} />
                        <InfoItem label="Firm Code" value={data.firmCode} />
                        <InfoItem
                            label="Status"
                            value={<StatusBadge isActive={data.isActive} />}
                        />
                    </div>
                </ComponentCard>

                {/* ================= Firm Details ================= */}
                {firmDetails && (
                    <ComponentCard title="Firm Details">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            <InfoItem
                                label="Address"
                                value={firmDetails.address}
                            />
                            <InfoItem
                                label="Contact Number"
                                value={firmDetails.contactNumber}
                            />
                            <InfoItem
                                label="Contact Person"
                                value={firmDetails.contactPerson}
                            />
                            <InfoItem
                                label="GST Number"
                                value={firmDetails.gstNumber}
                            />
                            {/* <InfoItem
                                label="Status"
                                value={
                                    <StatusBadge
                                        isActive={firmDetails.isActive}
                                    />
                                }
                            /> */}
                        </div>

                        {/* ================= Logo ================= */}
                        {firmDetails.logoImagePath && (
                            <div className="mt-6">
                                <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                                    Firm Logo
                                </p>

                                <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                                    <Image
                                        src={firmDetails.logoImagePath}
                                        alt="Firm Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </ComponentCard>
                )}
            </div>
        </>
    );
}

/* ---------------- Helpers ---------------- */

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
            {label}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900 break-words">
            {value ?? "—"}
        </p>
    </div>
);

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
    <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
        }`}
    >
        {isActive ? "Active" : "Inactive"}
    </span>
);
