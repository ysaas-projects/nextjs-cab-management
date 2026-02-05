"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { enqueueSnackbar } from "notistack";
import {
  useGetSeasonByIdQuery,
  useUpdateSeasonMutation,
} from "@/features/season/seasonApi";

/* ================= COMPONENT ================= */
const EditSeasonPage = () => {
  const router = useRouter();
  const params = useParams();
  const seasonId = Number(params.id);

  /* ================= API ================= */
  const { data, isLoading } = useGetSeasonByIdQuery(seasonId, {
    skip: !seasonId,
  });

  const [updateSeason, { isLoading: isUpdating }] =
    useUpdateSeasonMutation();

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    seasonName: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (data?.data) {
      setForm({
        seasonName: data.data.seasonName,
        startDate: data.data.startDate.split("T")[0],
      endDate: data.data.endDate.split("T")[0],
        isActive: data.data.isActive,
      });
    }
  }, [data]);

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateSeason({
        seasonId,
        seasonName: form.seasonName,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      }).unwrap();

      enqueueSnackbar("Season updated successfully", {
        variant: "success",
      });

      router.push("/seasons");
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to update season",
        { variant: "error" }
      );
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return <div className="p-6">Loading season...</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-lg font-semibold">Edit Season</h2>

      <div className="space-y-4">
        <CustomInput
          label="Season Name"
          name="seasonName"
          value={form.seasonName}
          onChange={handleChange}
          placeholder="Enter season name"
        />

        <CustomInput
          type="date"
          label="Start Date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <CustomInput
          type="date"
          label="End Date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>
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

export default EditSeasonPage;
