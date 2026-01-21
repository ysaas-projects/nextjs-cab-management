"use client";

// pricing-rules/page.tsx
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import PricingRuleTable from "./table";
import { useGetPricingRulesQuery } from "@/features/pricingRule/pricingRuleApi";
import { PricingRule } from "@/features/pricingRule/pricingRule.types";

export default function PricingRules() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading, isError } =
    useGetPricingRulesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading pricing rules.</div>;

  // ✅ API already returns array
  const pricingRules: PricingRule[] = data ?? [];

  const totalPages = Math.ceil(
    pricingRules.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedData = pricingRules.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Pricing Rules" />

      <div className="space-y-6">
        <ComponentCard
          title="Pricing Rule List"
          desc={`Total ${pricingRules.length} records found.`}
          action={
            <Link href="/pricing-rules/create">
              <Button variant="primary" size="sm">
                + Add Pricing Rule
              </Button>
            </Link>
          }
        >
          {/* ✅ PASS DIRECT DATA */}
          <PricingRuleTable data={paginatedData} />

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
