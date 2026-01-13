"use client";

//pricing-rules/table.tsx
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useDeletePricingRuleMutation } from "@/features/pricingRule";
import { useState } from "react";

type Props = {
    data: {
        id: number;
        firmId: number;
        roleDetails: string;
        isActive: boolean;
    }[];
};

const PricingRuleTable = ({ data }: Props) => {
    const [deletePricingRule, { isLoading: isDeleting }] = useDeletePricingRuleMutation();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this pricing rule?");
        if (!confirmed) return;

        try {
            setDeletingId(id);
            await deletePricingRule(id).unwrap();
            enqueueSnackbar("Pricing rule deleted successfully", { variant: "success" });
        } catch (err: any) {
            console.error("Failed to delete pricing rule", err);
            enqueueSnackbar(err?.data?.message || "Failed to delete pricing rule", { variant: "error" });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="px-6 py-3">Sr. No.</th>
                        <th className="px-6 py-3">Firm ID</th>
                        <th className="px-6 py-3">Role Details</th>
                        <th className="px-6 py-3">Active</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-t hover:bg-red-150 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-800">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4">{item.firmId}</td>
                            <td className="px-6 py-4">{item.roleDetails}</td>
                            <td className="px-6 py-4">{item.isActive ? "Yes" : "No"}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                                <Link href={`/pricing-rules/edit/${item.id}`}>
                                    <Button
                                        size="xs"
                                        variant="primary"
                                        outline
                                        startIcon={<Icon name="PencilIcon" className="w-5 h-5" />}
                                    >
                                        Edit
                                    </Button>
                                </Link>

                                <Button
                                    size="xs"
                                    variant="danger"
                                    outline
                                    startIcon={<Icon name="TrashBinIcon" className="w-5 h-5" />}
                                    onClick={() => handleDelete(item.id)}
                                    isLoading={isDeleting && deletingId === item.id}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PricingRuleTable;