"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";

import {
  useCreateCityMutation,
  citySchema,
} from "@/features/city";

import { useGetStatesQuery } from "@/features/location/locationApi";

export default function CreateCityPage() {

  const router = useRouter();

  const { data: states = [] } = useGetStatesQuery();

  const [createCity, { isLoading }] = useCreateCityMutation();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    cityName: "",
    stateId: null as number | null,
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setErrors({});
    setFormError(null);

    const result = citySchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setFormError("Please fix the errors below and try again.");
      return;
    }

    try {
      const response = await createCity(result.data).unwrap();

      enqueueSnackbar("City created successfully", {
        variant: "success",
      });

      router.push("/settings/cities");

    } catch (err) {
      setFormError("Something went wrong while saving the city.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add New City
        </h1>
        <p className="text-sm text-gray-500">
          Provide city information
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-10 p-6">

          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* SECTION HEADER */}
          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              City Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* CITY NAME */}
              <CustomInput
                label="City Name"
                name="cityName"
                value={form.cityName}
                onChange={handleChange}
                error={errors.cityName}
              />

              {/* STATE DROPDOWN */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  State
                </label>

                <select
                  name="stateId"
                  className="w-full rounded-lg border px-3 py-2"
                  value={form.stateId ?? ""}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      stateId: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                >
                  <option value="">Select State</option>

                  {states?.map(state => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </option>
                  ))}
                </select>

                {errors.stateId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.stateId}
                  </p>
                )}
              </div>
            </div>

            {/* ACTIVE CHECK */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={() =>
                  setForm(prev => ({ ...prev, isActive: !prev.isActive }))
                }
              />
              <span>Active</span>
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              variant="default"
              onClick={() => history.back()}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isLoading}
            >
              Save City
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
