"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/atoms/Button";

import CustomerUserTable from "./table";

import {
  useGetCustomerUsersQuery,
} from "@/features/customerUser";
import { useGetCustomersQuery } from "@/features/customer/customerApi";

export default function CustomerUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filterCustomerId, setFilterCustomerId] = useState<number>(0);

  const { data: customers } = useGetCustomersQuery();
  const customerList = customers ?? [];

  const customerNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of customerList) {
      map.set(c.customerId, c.customerName);
    }
    return map;
  }, [customerList]);

  const {
    data: allUsers,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetCustomerUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const users = useMemo(() => {
    const list = allUsers ?? [];
    if (!filterCustomerId) return list;
    return list.filter((u) => u.customerId === filterCustomerId);
  }, [allUsers, filterCustomerId]);

  const isLoading = isLoadingAll;
  const isError = isErrorAll;

  const totalCount = users.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return users.slice(start, start + itemsPerPage);
  }, [users, currentPage]);

  const transformedData = currentItems.map((u, index) => ({
    id: u.customerUserId,
    srNo: (currentPage - 1) * itemsPerPage + (index + 1),
    customerId: u.customerId,
    customerName: customerNameById.get(u.customerId) ?? "—",
    userName: u.userName,
    mobileNumber: u.mobileNumber ?? "—",
    isActive: u.isActive,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Customer Users" />

      <div className="space-y-6">
        <ComponentCard
          title="Customer User List"
          desc={`Total ${totalCount} records found.`}
          action={
            <Link href="/customer-users/create">
              <Button variant="primary" size="sm">
                + Add Customer User
              </Button>
            </Link>
          }
        >
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Filter by Customer
              </label>
              <select
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                value={filterCustomerId}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterCustomerId(Number(e.target.value));
                }}
              >
                <option value={0}>All Customers</option>
                {customerList.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && <div>Loading...</div>}
          {isError && <div>Error loading customer users.</div>}

          {!isLoading && !isError && (
            <>
              <CustomerUserTable data={transformedData} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
