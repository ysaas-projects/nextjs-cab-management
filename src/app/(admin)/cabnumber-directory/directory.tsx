"use client";

import { useState } from "react";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";

import {
  useGetCabWiseCabNumbersQuery,
  useCreateCabNumberDirectoryMutation,
  useDeleteCabNumberDirectoryMutation,
} from "@/features/cabnumberdirectory";

export default function CabNumberDirectory() {
  // 🔹 APIs
  const { data, isLoading } = useGetCabWiseCabNumbersQuery();
  const [createCabNumber] = useCreateCabNumberDirectoryMutation();
  const [deleteCabNumber] = useDeleteCabNumberDirectoryMutation();

  // 🔹 Local UI states
  const [activeCabId, setActiveCabId] = useState<number | null>(null);
  const [newCabNumber, setNewCabNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading...</p>;
  }

  const cabList = data?.data ?? [];

  // 🔹 SAVE HANDLER
  const handleSave = async (cabId: number) => {
    if (!newCabNumber.trim()) {
      enqueueSnackbar("Cab number is required", { variant: "error" });
      return;
    }

    try {
      setIsSaving(true);

      await createCabNumber({
        cabId,
        cabNumber: newCabNumber.trim().toUpperCase(),
        isActive: true,
      }).unwrap();

      enqueueSnackbar("Cab number added successfully", {
        variant: "success",
      });

      // reset UI
      setActiveCabId(null);
      setNewCabNumber("");
    } catch {
      enqueueSnackbar("Failed to add cab number", {
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* HEADER */}
      <div className="grid grid-cols-[200px_1fr] gap-10 border-b pb-3 mb-4 font-semibold">
        <div>Cabs</div>
        <div>Cab Numbers</div>
      </div>

      {/* ROWS */}
      <div className="space-y-6">
        {cabList.map((cab) => (
          <div
            key={cab.cabId}
            className="grid grid-cols-[200px_1fr] gap-10 items-start"
          >
            {/* LEFT : CAB */}
            <div className="text-blue-600 font-medium">
              {cab.cabType}
            </div>

            {/* RIGHT : CAB NUMBERS */}
            <div>
              {/* EXISTING NUMBERS */}
              {cab.cabNumbers.length > 0 ? (
                <div className="space-y-2">
                  {cab.cabNumbers.map((num) => (
                    <div
                      key={num.cabNumberDirectoryId}
                      className="flex items-center gap-3"
                    >
                      <span className="text-blue-600">
                        {num.cabNumber}
                      </span>

                      {/* DELETE */}
                      <button
                        title="Delete cab number"
                        onClick={async () => {
                          if (!confirm("Delete this cab number?")) return;

                          try {
                            await deleteCabNumber(
                              num.cabNumberDirectoryId
                            ).unwrap();

                            enqueueSnackbar(
                              "Cab number removed",
                              { variant: "success" }
                            );
                          } catch {
                            enqueueSnackbar(
                              "Failed to remove cab number",
                              { variant: "error" }
                            );
                          }
                        }}
                      >
                        <Icon
                          name="CloseIcon"
                          className="w-4 h-4 text-gray-400 hover:text-red-500"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No cab number assigned
                </p>
              )}

              {/* ADD NEW INLINE FORM */}
              {activeCabId === cab.cabId ? (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newCabNumber}
                    onChange={(e) =>
                      setNewCabNumber(e.target.value.toUpperCase())
                    }
                    placeholder="Enter cab number"
                    className="border rounded px-2 py-1 w-48"
                  />

                  <Button
                    size="xs"
                    variant="primary"
                    isLoading={isSaving}
                    onClick={() => handleSave(cab.cabId)}
                  >
                    Save
                  </Button>

                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => {
                      setActiveCabId(null);
                      setNewCabNumber("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="xs"
                  variant="default"
                  className="mt-2"
                  disabled={activeCabId !== null}
                  onClick={() => {
                    setActiveCabId(cab.cabId);
                    setNewCabNumber("");
                  }}
                >
                  Add New
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
