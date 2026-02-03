"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import Link from "next/link";

import SeasonTable from "./table";
import { useGetSeasonsQuery } from "@/features/season/seasonApi";

export default function SeasonsPage() {
  const { data, isLoading, isError } = useGetSeasonsQuery();

  if (isLoading) return <div>Loading seasons...</div>;
  if (isError) return <div>Failed to load seasons.</div>;

  const seasons = data?.data ?? [];

  const tableData = seasons.map((s) => ({
    id: s.seasonId,
    name: s.seasonName,
    startDate: s.startDate,
    endDate: s.endDate,
    isActive: s.isActive,
  }));

  return (
    <>
      <PageBreadcrumb pageTitle="Seasons" />

      <ComponentCard
        title="Season List"
        desc={`Total ${tableData.length} records found.`}
        action={
          <Link href="/seasons/create">
            <Button variant="primary" size="sm">
              + Add Season
            </Button>
          </Link>
        }
      >
        <SeasonTable data={tableData} />
      </ComponentCard>
    </>
  );
}
