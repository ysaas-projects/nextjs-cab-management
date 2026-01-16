"use client";

import { useParams } from "next/navigation";
import { useGetCabByIdQuery } from "@/features/cab";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";

export default function CabDetailPage() {
    const params = useParams();
    const cabId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || "0", 10);

    const { data: cab, isLoading, isError } = useGetCabByIdQuery(cabId);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !cab) return <div>Error loading cab.</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Cab Details</h1>
                    <p className="text-sm text-gray-500">View cab information</p>
                </div>
                <Link href={`/cabs/edit/${cabId}`}>
                    <Button variant="primary" size="sm">
                        <Icon name="PencilIcon" className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cab ID</label>
                            <p className="mt-1 text-lg font-semibold">{(cab as any).cabId}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Firm ID</label>
                            <p className="mt-1 text-lg font-semibold">{(cab as any).firmId}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cab Type</label>
                            <p className="mt-1 text-lg font-semibold">{(cab as any).cabType}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <p className="mt-1 text-lg font-semibold">{(cab as any).isActive ? "Active" : "Inactive"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <p className="mt-1 text-lg font-semibold">{new Date((cab as any).createdAt).toLocaleDateString()}</p>
                        </div>
                        {(cab as any).updatedAt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Updated At</label>
                                <p className="mt-1 text-lg font-semibold">{new Date((cab as any).updatedAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
