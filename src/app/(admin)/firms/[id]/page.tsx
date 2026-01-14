"use client";
// /firms/[id]/page.tsx
import { useParams } from "next/navigation";
import FirmProfileView from "./FirmProfileView";

export default function FirmDetailsPage() {
    const params = useParams();
    const firmId = Number(params.id);

    if (!firmId || Number.isNaN(firmId)) {
        return <div>Invalid Firm ID</div>;
    }

    return <FirmProfileView firmId={firmId} />;
}
