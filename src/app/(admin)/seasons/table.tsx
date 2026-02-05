"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { enqueueSnackbar, closeSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import { useDeleteSeasonMutation } from "@/features/season/seasonApi";

/* ================= PROPS ================= */
type Props = {
  data: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }[];
};

const SeasonTable = ({ data }: Props) => {
  const router = useRouter();
  const [deleteSeason] = useDeleteSeasonMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER ============ */
  const handleDelete = (id: number) => {
    enqueueSnackbar("Are you sure you want to delete this season?", {
      variant: "warning",
      persist: true,
      action: (snackbarId) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="danger"
            isLoading={deletingId === id}
            onClick={async () => {
              try {
                setDeletingId(id);
                await deleteSeason(id).unwrap();

                enqueueSnackbar("Season deleted successfully", {
                  variant: "success",
                });
              } catch (err: any) {
                enqueueSnackbar(
                  err?.data?.message || "Failed to delete season",
                  { variant: "error" }
                );
              } finally {
                setDeletingId(null);
                closeSnackbar(snackbarId);
              }
            }}
          >
            Delete
          </Button>

          <Button
            size="xs"
            variant="default"
            onClick={() => closeSnackbar(snackbarId)}
          >
            Cancel
          </Button>
        </div>
      ),
    });
  };

  /* ============ TABLE ============ */
  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Season</th>
            <th className="px-6 py-3">Start</th>
            <th className="px-6 py-3">End</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`border-t transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              {/* VIEW DETAILS */}
              <td
                className="px-6 py-4 text-link cursor-pointer"
                onClick={() =>
                  router.push(`/seasons/${item.id}`)
                }
              >
                {item.name}
              </td>

              <td className="px-6 py-4">
                {item.startDate}
              </td>

              <td className="px-6 py-4">
                {item.endDate}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 text-center space-x-2">
                <Button
                  size="xs"
                  variant="primary"
                  outline
                  onClick={() =>
                    router.push(`/seasons/edit/${item.id}`)
                  }
                >
                  Edit
                </Button>

                <Button
                  size="xs"
                  variant="danger"
                  outline
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-gray-500"
              >
                No seasons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonTable;
