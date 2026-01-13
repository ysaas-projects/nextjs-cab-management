"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import CompaniesTable from "./table";
import { useGetPaginatedCompaniesQuery } from "@/features/company/companyApi";
import { Company } from "@/features/company/company.types";
import RequireRole from "@/components/auth/RequireRole";
import { ROLES } from "@/constants/roles";

export default function Companies() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, isLoading, isError } = useGetPaginatedCompaniesQuery({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading companies.</div>;

    const companies: Company[] = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalCount = data?.totalCount ?? 0;

    const tableData = companies.map((company) => ({
        id: company.companyId,
        companyName: company.companyName,
        location: `${company.cityName}, ${company.stateName}`,
        contactDetails: company.contactEmail || company.contactPhone || "-",
    }));

    return (
        <RequireRole allowedRoles={[ROLES.SUPER_ADMIN]}>

            <PageBreadcrumb pageTitle="Manage Companies (Buyers)" />

            <div className="space-y-6">
                <ComponentCard
                    title="Companies List"
                    desc={`Total ${totalCount} companies found`}
                    action={
                        <Link href="/companies/create">
                            <Button variant="primary" size="sm">
                                + Add Company
                            </Button>
                        </Link>
                    }
                >
                    <CompaniesTable data={tableData} />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </ComponentCard>
            </div>
        </RequireRole>
    );
}
