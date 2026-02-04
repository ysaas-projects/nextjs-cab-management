"use client";

import { useParams } from "next/navigation";
import SeasonProfileView from "./SeasonProfilePage";

export default function SeasonProfilePage() {
  const params = useParams();
  const id = Number(params.id);

  if (!id) {
    return <div>Invalid season id.</div>;
  }

  return <SeasonProfileView seasonId={id} />;
}
