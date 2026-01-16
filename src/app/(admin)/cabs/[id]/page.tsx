"use client";
// /cabs/[id]/page.tsx
import { useParams } from "next/navigation";
import CabProfileView from "./CabProfileView";

export default function CabDetailsPage() {
    const params = useParams();
    const cabId = Number(params.id);

    if (!cabId || Number.isNaN(cabId)) {
        return <div>Invalid Cab ID</div>;
    }

    return <CabProfileView cabId={cabId} />;
}
