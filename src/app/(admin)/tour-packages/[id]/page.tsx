"use client";

import { useParams } from "next/navigation";
import TourPackageProfileView from "./TourPackageProfileView";

export default function TourPackageDetailsPage() {
  const params = useParams();
  const packageId = Number(params.id);

  if (!packageId || Number.isNaN(packageId)) {
    return <div>Invalid Package ID</div>;
  }

  return <TourPackageProfileView packageId={packageId} />;
}
