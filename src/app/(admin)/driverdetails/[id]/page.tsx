"use client";

import { useParams } from "next/navigation";
import DriverDetailProfileView from "./DriverDetailProfileView";

export default function DriverDetailPage() {
  const params = useParams();
  const driverDetailId = Number(params.id);

  return <DriverDetailProfileView driverDetailId={driverDetailId} />;
}
