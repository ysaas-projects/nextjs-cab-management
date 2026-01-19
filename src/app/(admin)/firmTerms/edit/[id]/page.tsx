"use client";

import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditFirmTermPage from "./editfirmTermPage";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Firm Term" />
      <EditFirmTermPage id={id} />
    </>
  );
}
