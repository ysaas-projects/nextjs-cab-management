"use client";

import { useParams } from "next/navigation";
import MillProfileView from "./MillProfileView";

export default function MillDetailsPage() {
  const params = useParams();
  const millId = Number(params.id);

  return <MillProfileView millId={millId} />;
}
