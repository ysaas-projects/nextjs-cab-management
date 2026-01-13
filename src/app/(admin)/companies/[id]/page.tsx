"use client";

import { useParams } from "next/navigation";
import CompanyProfileView from "./CompanyProfileView";

export default function CompanyDetailsPage() {
  const params = useParams();
  const companyId = Number(params.id);

  return <CompanyProfileView companyId={companyId} />;
}
