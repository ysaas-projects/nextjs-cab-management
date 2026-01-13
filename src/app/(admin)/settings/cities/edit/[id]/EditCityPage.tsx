"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CustomInput from "@/components/atoms/CustomInput";
import LocationSelector from "@/components/molecules/LocationSelector";

import {
  useGetCityByIdQuery,
  useUpdateCityMutation,
} from "@/features/city";

import { enqueueSnackbar } from "notistack";

export default function EditCityPage() {

  const router = useRouter();
  const params = useParams();

  const cityId = Number(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const { data: city, isLoading } = useGetCityByIdQuery(cityId, {
    skip: !cityId,
  });

  const [updateCity] = useUpdateCityMutation();

  const [form, setForm] = useState({
    cityName: "",
    stateId: null as number | null,
    isActive: true,
  });

  // Load API Data into form
  useEffect(() => {
    if (city && !isLoading) {
      setForm({
        cityName: city.cityName,
        stateId: city.stateId ?? null,
        isActive: city.isActive,
      });
    }
  }, [city, isLoading]);

  const handleSave = async () => {
    await updateCity({
      cityId,
      cityName: form.cityName,
      stateId: form.stateId ?? undefined,
      isActive: form.isActive,
    }).unwrap();

    enqueueSnackbar("City updated successfully", {
      variant: "success",
    });

    router.push("/settings/cities");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">

      <h1 className="text-2xl font-semibold mb-2">Edit City</h1>
      <p className="text-sm text-gray-500 mb-4">
        Modify city information
      </p>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-8 p-6">

          {/* CITY NAME TEXTBOX */}
          <CustomInput
            label="City Name"
            name="cityName"
            value={form.cityName}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                cityName: e.target.value,
              }))
            }
          />

          {/* STATE DROPDOWN ONLY (City dropdown hidden) */}
          <div className="hide-city-dropdown">
            <LocationSelector
              stateId={form.stateId}
              cityId={null}
              onStateChange={(val) =>
                setForm(prev => ({
                  ...prev,
                  stateId: val ?? null,
                }))
              }
              onCityChange={() => {}}
            />
          </div>

          {/* ACTIVE TOGGLE */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            Active
          </label>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t pt-6">

            <button
              onClick={() => history.back()}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white"
            >
              Save City
            </button>
          </div>

        </div>
      </div>

      {/* === HIDE ONLY CITY DROPDOWN (SCOPED) === */}
      <style jsx global>{`
        .hide-city-dropdown div:has(> select[name="city"]) {
          display: none !important;
        }
      `}</style>

    </div>
  );
}
