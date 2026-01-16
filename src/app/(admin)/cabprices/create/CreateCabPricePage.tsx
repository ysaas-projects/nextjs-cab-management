"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomSelect from "@/components/atoms/CustomSelect";
import CustomInput from "@/components/atoms/CustomInput";
import { enqueueSnackbar } from "notistack";

import { useCreateCabPriceMutation } from "@/features/cabprice";
import { useGetCabsQuery } from "@/features/cab";
import { useGetPricingRulesQuery } from "@/features/pricingRule";

export default function CreateCabPricePage() {
  const router = useRouter();

  // 🔹 Master data
  const { data: cabs = [] } = useGetCabsQuery();
  const { data: pricingRules = [] } = useGetPricingRulesQuery();

  const [createCabPrice, { isLoading }] = useCreateCabPriceMutation();

  // 🔹 Form state (NO firmId – firm comes from token in backend)
  const [form, setForm] = useState({
    cabId: "",
    pricingRuleId: "",
    price: "",
    isActive: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.cabId || !form.pricingRuleId || !form.price) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }

    try {
      const response = await createCabPrice({
        cabId: Number(form.cabId),
        pricingRuleId: Number(form.pricingRuleId),
        price: Number(form.price),
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Cab price created successfully", {
        variant: "success",
      });

      // 🔥 Redirect to VIEW page
      router.push(`/cabprices/${response.cabPriceId}`);
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to create cab price",
        { variant: "error" }
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Cab Price" />

      <ComponentCard title="Add Cab Price">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ✅ Cab dropdown */}
          <CustomSelect
            label="Cab"
            name="cabId"
            value={form.cabId}
            onChange={handleChange}
            options={cabs.map((c) => ({
              id: c.cabId,
              name: c.cabType,
            }))}
          />

          {/* ✅ Pricing Rule dropdown */}
          <CustomSelect
            label="Pricing Rule"
            name="pricingRuleId"
            value={form.pricingRuleId}
            onChange={handleChange}
            options={pricingRules.map((r) => ({
              id: r.pricingRuleId,
              name: r.ruleDetails, // pricingRuleName
            }))}
          />

          {/* ✅ Price */}
          <CustomInput
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Active checkbox */}
        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="default" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Save Cab Price
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
