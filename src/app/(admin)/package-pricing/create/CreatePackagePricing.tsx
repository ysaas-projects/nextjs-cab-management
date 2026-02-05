"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import CustomSelect from "@/components/atoms/CustomSelect";

import { useCreatePackagePricingMutation } from "@/features/packagepricing";
import { useGetTourPackagesQuery } from "@/features/tourpackage";

/* ===============================
   FORM STATE
================================ */
type FormState = {
  packageId: number;
  dayType: "Weekday" | "Weekend";
  pricePerPerson: string;
  minPersons: string;
};

export default function CreatePackagePricing() {
  const router = useRouter();

  const [createPricing, { isLoading }] =
    useCreatePackagePricingMutation();

  const { data: packageRes, isLoading: loadingPackages } =
    useGetTourPackagesQuery();

  const packages = packageRes?.data ?? [];

  const [form, setForm] = useState<FormState>({
    packageId: 0,
    dayType: "Weekday",
    pricePerPerson: "",
    minPersons: "1",
  });

  /* ===============================
     HANDLERS
  ================================ */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "packageId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.packageId) {
      enqueueSnackbar("Please select a package", {
        variant: "error",
      });
      return;
    }

    try {
      await createPricing({
        packageId: form.packageId,
        dayType: form.dayType,
        pricePerPerson: Number(form.pricePerPerson),
        minPersons: Number(form.minPersons),
      }).unwrap();

      enqueueSnackbar(
        "Package pricing created successfully",
        { variant: "success" }
      );

      router.push("/package-pricing");
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message ||
          "Failed to create package pricing",
        { variant: "error" }
      );
    }
  };

  /* ===============================
     UI
  ================================ */
  return (
    <>
      <PageBreadcrumb pageTitle="Add Package Pricing" />

      <ComponentCard title="Package Pricing">
        {/* PACKAGE DROPDOWN */}
        <CustomSelect
          label="Package"
          name="packageId"
          value={form.packageId}
          onChange={handleChange}
          disabled={loadingPackages}
          options={[
            { id: 0, name: "Select Package" },
            ...packages.map((p) => ({
              id: p.packageId,
              name: p.packageName, // ✅ correct
            })),
          ]}
          error={
            form.packageId === 0
              ? "Package is required"
              : undefined
          }
        />

        {/* DAY TYPE */}
        <CustomSelect
          label="Day Type"
          name="dayType"
          value={form.dayType}
          onChange={handleChange}
          options={[
            { id: "Weekday", name: "Weekday" },
            { id: "Weekend", name: "Weekend" },
          ]}
        />

        {/* PRICE */}
        <CustomInput
          label="Price Per Person"
          name="pricePerPerson"
          type="number"
          value={form.pricePerPerson}
          onChange={handleChange}
        />

        {/* MIN PERSONS */}
        <CustomInput
          label="Minimum Persons"
          name="minPersons"
          type="number"
          value={form.minPersons}
          onChange={handleChange}
        />

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Save Pricing
          </Button>

          <Button
            variant="default"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
