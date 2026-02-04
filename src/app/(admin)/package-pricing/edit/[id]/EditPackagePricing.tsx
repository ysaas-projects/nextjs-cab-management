"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import CustomSelect from "@/components/atoms/CustomSelect";
import {
  useGetPackagePricingByIdQuery,
  useUpdatePackagePricingMutation,
} from "@/features/packagepricing";

/* ================= TYPES ================= */
type DayType = "Weekday" | "Weekend";

/* ================= OPTIONS ================= */
const dayTypeOptions = [
  { id: "Weekday", name: "Weekday" },
  { id: "Weekend", name: "Weekend" },
];

const EditPackagePricingPage = () => {
  const router = useRouter();
  const params = useParams();
  const pricingId = Number(params.id);

  const { data, isLoading } = useGetPackagePricingByIdQuery(pricingId, {
    skip: !pricingId,
  });

  const [updatePricing, { isLoading: isUpdating }] =
    useUpdatePackagePricingMutation();

  const [form, setForm] = useState<{
    dayType: DayType;
    pricePerPerson: string;
    minPersons: string;
  }>({
    dayType: "Weekday",
    pricePerPerson: "",
    minPersons: "",
  });

  useEffect(() => {
    if (data?.data) {
      setForm({
        dayType: data.data.dayType,
        pricePerPerson: String(data.data.pricePerPerson),
        minPersons: String(data.data.minPersons),
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updatePricing({
        pricingId,
        dayType: form.dayType,
        pricePerPerson: Number(form.pricePerPerson),
        minPersons: Number(form.minPersons),
      }).unwrap();

      enqueueSnackbar("Package pricing updated successfully", {
        variant: "success",
      });

      router.push("/package-pricing");
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to update package pricing",
        { variant: "error" }
      );
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading package pricing...</div>;
  }

  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-lg font-semibold">
        Edit Package Pricing
      </h2>

      <div className="space-y-4">
        <CustomSelect
          label="Day Type"
          name="dayType"
          value={form.dayType}
          options={dayTypeOptions}
          onChange={handleChange}
        />

        <CustomInput
          label="Price Per Person"
          type="number"
          name="pricePerPerson"
          value={form.pricePerPerson}
          onChange={handleChange}
        />

        <CustomInput
          label="Minimum Persons"
          type="number"
          name="minPersons"
          value={form.minPersons}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="primary"
          isLoading={isUpdating}
          onClick={handleSubmit}
        >
          Update
        </Button>

        <Button
          variant="default"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditPackagePricingPage;
