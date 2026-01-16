"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import CustomSelect from "@/components/atoms/CustomSelect";
import { enqueueSnackbar } from "notistack";

import { useCreateCabPriceMutation } from "@/features/cabprice";
import { useGetFirmsQuery } from "@/features/firm/firmApi";
import { useGetCabsQuery } from "@/features/cab";

export default function CreateCabPricePage() {
  const router = useRouter();

  const { data: firms = [] } = useGetFirmsQuery();
  const { data: cabs = [] } = useGetCabsQuery();

  const [createCabPrice, { isLoading }] = useCreateCabPriceMutation();

  const [form, setForm] = useState({
    firmId: "",
    cabId: "",
    pricingRuleId: "",
    price: "",
    isActive: true,
  });

  // ✅ SAME handler as EDIT
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.firmId || !form.cabId || !form.pricingRuleId || !form.price) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }

    try {
      await createCabPrice({
        firmId: Number(form.firmId),
        cabId: Number(form.cabId),
        pricingRuleId: Number(form.pricingRuleId),
        price: Number(form.price),
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Cab price created successfully", {
        variant: "success",
      });

      router.push("/cabprices");
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

          {/* ✅ SAME Firm dropdown as EDIT */}
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

          {/* ✅ SAME Cab dropdown as EDIT */}
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

          <CustomInput
            label="Pricing Rule ID"
            name="pricingRuleId"
            type="number"
            value={form.pricingRuleId}
            onChange={handleChange}
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
            Save Cab Price
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
