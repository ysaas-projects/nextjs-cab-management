"use client";

import { useState } from "react";
import Link from "next/link";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";

import {
  useGetPaginatedCitiesQuery,
  City,
} from "@/features/city";

import CityTable from "./table";

export default function CityListPage() {

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, isError } = useGetPaginatedCitiesQuery({
    pageNumber: currentPage,
    pageSize,
  });

  if (isLoading) return <div>Loading cities...</div>;
  if (isError) return <div>Failed to load cities.</div>;

  const cities: City[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  // 🔹 Convert API → UI format safely
  const transformedData = cities.map(city => ({
    id: city.cityId,
    cityName: city.cityName,
    stateName: city.stateName ?? "",   // 🟢 prevents TS undefined error
    status: city.isActive,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Cities" />

      <div className="space-y-6">
        <ComponentCard
          title="City List"
          desc={`Total ${totalCount} records found.`}
          action={
            <Link href="/settings/cities/create">
              <button className="btn btn-primary text-sm">
                + Add City
              </button>
            </Link>
          }
        >
          <CityTable data={transformedData} />

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
