"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import CustomSelect from "@/components/atoms/CustomSelect";
import { enqueueSnackbar } from "notistack";
import { useGetPricingRulesQuery } from "@/features/pricingRule";

import {
  useGetCabPricesQuery,
  useUpdateCabPriceMutation,
} from "@/features/cabprice";
import { useGetCabsQuery } from "@/features/cab";
import { useGetFirmsQuery } from "@/features/firm/firmApi";

export default function EditCabPricePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const cabPriceId = Number(params.id);

  const { data: cabPrices = [] } = useGetCabPricesQuery();
  const { data: firms = [] } = useGetFirmsQuery();
  const { data: cabs = [] } = useGetCabsQuery();
const { data: pricingRules = [] } = useGetPricingRulesQuery();

  const [updateCabPrice, { isLoading }] = useUpdateCabPriceMutation();

  const cabPrice = cabPrices.find(
    (p) => p.cabPriceId === cabPriceId
  );

  const [form, setForm] = useState({
    firmId: "",
    cabId: "",
    pricingRuleId: "",
    price: "",
    isActive: true,
  });

  // 🔹 Prefill values
  useEffect(() => {
    if (cabPrice) {
      setForm({
        firmId: String(cabPrice.firmId),
        cabId: String(cabPrice.cabId),
        pricingRuleId: String(cabPrice.pricingRuleId),
        price: String(cabPrice.price),
        isActive: cabPrice.isActive,
      });
    }
  }, [cabPrice]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateCabPrice({
        cabPriceId,
        payload: {
          firmId: Number(form.firmId),
          cabId: Number(form.cabId),
          pricingRuleId: Number(form.pricingRuleId),
          price: Number(form.price),
          isActive: form.isActive,
        },
      }).unwrap();

      enqueueSnackbar("Cab price updated successfully", {
        variant: "success",
      });

      router.push("/cabprices");
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to update cab price",
        { variant: "error" }
      );
    }
  };

  if (!cabPrice) return <div className="p-6">Loading...</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Cab Price" />

      <ComponentCard title="Edit Cab Price">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <CustomSelect
            label="Firm"
            name="firmId"
            value={form.firmId}
            onChange={handleChange}
            options={firms.map((f) => ({
  id: f.firmId,
  name: f.firmName,
}))}
          />

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

          <CustomSelect
  label="Pricing Rule"
  name="pricingRuleId"
  value={form.pricingRuleId}
  onChange={handleChange}
  options={pricingRules.map((r) => ({
    id: r.pricingRuleId,      // backend la janar
    name: r.ruleDetails,      // UI la disnar (pricingRuleName)
  }))}
/>
          <CustomInput
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="default" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Update Cab Price
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
