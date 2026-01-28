"use client";

import { useParams } from "next/navigation";
import EditCustomerPage from "./EditCustomerPage";

export default function EditCustomerDetailsPage() {
  const params = useParams();
  const customerId = Number(params.id);

  if (!customerId || Number.isNaN(customerId)) {
    return <div>Invalid Customer ID</div>;
  }

  return <EditCustomerPage />;
}
