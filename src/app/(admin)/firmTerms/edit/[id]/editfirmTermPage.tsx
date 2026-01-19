"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import ComponentCard from "@/components/common/ComponentCard";
import { enqueueSnackbar } from "notistack";

import {
  useGetFirmTermByIdQuery,
  useUpdateFirmTermMutation,
} from "@/features/firmTerms";

type Props = {
  id: number;
};

export default function EditFirmTermPage({ id }: Props) {
  const router = useRouter();

  const { data, isLoading } = useGetFirmTermByIdQuery(id);
  const [updateFirmTerm, { isLoading: saving }] =
    useUpdateFirmTermMutation();

  // ✅ form values as STRING (important)
  const [form, setForm] = useState({
  firmId: "",        // string
  description: "",
  isActive: true,
});


  // ================= PREFILL =================
  useEffect(() => {
    if (data) {
      setForm({
        firmId: String(data.firmId),   // ✅ convert number → string
        description: data.description ?? "",
        isActive: data.isActive,
      });
    }
  }, [data]);

  // ================= CHANGE =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!form.firmId || !form.description) {
      enqueueSnackbar("Firm ID and Description are required", {
        variant: "error",
      });
      return;
    }

    try {
      await updateFirmTerm({
        id,
        payload: {
          firmId: Number(form.firmId), // ✅ convert back to number
          description: form.description,
          isActive: form.isActive,
        },
      }).unwrap();

      enqueueSnackbar("Firm term updated successfully", {
        variant: "success",
      });

      router.push("/firmTerms");
    } catch {
      enqueueSnackbar("Failed to update firm term", {
        variant: "error",
      });
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <ComponentCard title="Edit Firm Term">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Firm ID"
          name="firmId"
          value={form.firmId}
          onChange={handleChange}
        />

        <CustomInput
          label="Description"
          name="description"
          value={form.description}
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
          onClick={handleSave}
          isLoading={saving}
        >
          Save Changes
        </Button>
      </div>
    </ComponentCard>
  );
}
