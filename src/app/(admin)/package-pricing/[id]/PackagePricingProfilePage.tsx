"use client";

import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";

import { useGetPackagePricingByIdQuery } from "@/features/packagepricing";

export default function PackagePricingProfilePage() {
  const router = useRouter();
  const params = useParams();

  const pricingId = Number(params.id);

  const { data, isLoading, isError } =
    useGetPackagePricingByIdQuery(pricingId, {
      skip: !pricingId,
    });

  if (!pricingId) {
    return <div className="p-4">Invalid pricing.</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading pricing details...</div>;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-4 text-red-500">
        Failed to load pricing details.
      </div>
    );
  }

  const pricing = data.data;

  return (
    <>
      <PageBreadcrumb pageTitle="Package Pricing Details" />

      <ComponentCard title="Pricing Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* PACKAGE NAME */}
          <div>
            <p className="text-gray-500">Package Name</p>
            <p className="font-medium">
              {pricing.packageName}
            </p>
          </div>

          {/* DAY TYPE */}
          <div>
            <p className="text-gray-500">Day Type</p>
            <p className="font-medium">
              {pricing.dayType}
            </p>
          </div>

          {/* PRICE */}
          <div>
            <p className="text-gray-500">Price Per Person</p>
            <p className="font-medium">
              ₹ {pricing.pricePerPerson}
            </p>
          </div>

          {/* MIN PERSONS */}
          <div>
            <p className="text-gray-500">Minimum Persons</p>
            <p className="font-medium">
              {pricing.minPersons}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="primary"
            onClick={() =>
              router.push(
                `/package-pricing/edit/${pricing.pricingId}`
              )
            }
          >
            Edit Pricing
          </Button>

          <Button
            variant="default"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
