// src/app/(admin)/cabprices/[id]/CabPriceProfilePage.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import { useGetCabPriceQuery } from "@/features/cabprice";

export default function CabPriceProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const cabPriceId = Number(params.id);

  const {
    data: cabPrice,
    isLoading,
    isError,
  } = useGetCabPriceQuery(cabPriceId);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !cabPrice)
    return <div>Cab Price not found</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Cab Price Details" />

      <ComponentCard
        title="Cab Price Profile"
        action={
          <Button
            variant="primary"
            onClick={() =>
              router.push(`/cabprices/edit/${cabPriceId}`)
            }
          >
            Edit
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          {/* Cab */}
          <div>
            <p className="text-gray-500">Cab</p>
            <p className="font-medium text-gray-900">
              {cabPrice.cabType}
            </p>
          </div>

          {/* Pricing Rule */}
          <div>
            <p className="text-gray-500">Pricing Rule</p>
            <p className="font-medium text-gray-900">
              {cabPrice.pricingRuleName}
            </p>
          </div>

          {/* Price */}
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-medium text-gray-900">
              ₹{cabPrice.price}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-500">Status</p>
            <span
              className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                cabPrice.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {cabPrice.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Created At */}
          <div>
            <p className="text-gray-500">Created At</p>
            <p className="font-medium text-gray-900">
              {new Date(cabPrice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="default" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
