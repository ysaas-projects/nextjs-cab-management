"use client";
// /customers/[id]/page.tsx

import { useParams } from "next/navigation";
import CustomerProfileView from "./CustomerProfileView";

export default function CustomerDetailsPage() {
  const params = useParams();
  const customerId = Number(params.id);

  if (!customerId || Number.isNaN(customerId)) {
    return <div>Invalid Customer ID</div>;
  }

  return <CustomerProfileView customerId={customerId} />;
}
