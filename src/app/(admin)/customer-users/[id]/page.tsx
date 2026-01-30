"use client";
// /customer-users/[id]/page.tsx

import { useParams } from "next/navigation";
import CustomerUserProfileView from "./CustomerUserProfileView";

export default function CustomerUserDetailsPage() {
  const params = useParams();
  const customerUserId = Number(params.id);

  if (!customerUserId || Number.isNaN(customerUserId)) {
    return <div>Invalid Customer User ID</div>;
  }

  return <CustomerUserProfileView customerUserId={customerUserId} />;
}
