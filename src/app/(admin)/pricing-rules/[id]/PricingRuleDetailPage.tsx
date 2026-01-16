"use client";

import { useParams } from "next/navigation";
import { useGetPricingRuleByIdQuery } from "@/features/pricingRule/pricingRuleApi";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";

export default function PricingRuleDetailPage() {
    const params = useParams();
    const pricingRuleId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || "0", 10);

    const { data: pricingRule, isLoading, isError } = useGetPricingRuleByIdQuery(pricingRuleId);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !pricingRule) return <div>Error loading pricing rule.</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Pricing Rule Details</h1>
                    <p className="text-sm text-gray-500">
                        View pricing rule information
                    </p>
                </div>
                <Link href={`/pricing-rules/edit/${pricingRuleId}`}>
                    <Button variant="primary" size="sm">
                        <Icon name="PencilIcon" className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </Link>
            </div>

            {/* Card Container */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pricing Rule ID</label>
                            <p className="mt-1 text-lg font-semibold">{pricingRule.pricingRuleId}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Firm ID</label>
                            <p className="mt-1 text-lg font-semibold">{pricingRule.firmId}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Is Active</label>
                            <p className="mt-1 text-lg font-semibold">{pricingRule.isActive ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <p className="mt-1 text-lg font-semibold">{new Date(pricingRule.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Role Details</label>
                            <p className="mt-1 text-lg font-semibold whitespace-pre-wrap">{pricingRule.ruleDetails}</p>
                        </div>
                        {pricingRule.updatedAt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Updated At</label>
                                <p className="mt-1 text-lg font-semibold">{new Date(pricingRule.updatedAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}