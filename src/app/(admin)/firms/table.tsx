"use client";

import { useState } from "react";
import Link from "next/link";
import { enqueueSnackbar, closeSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { FirmWithDetails } from "@/features/firm";
import { useDeleteFirmMutation } from "@/features/firm/firmApi";

type Props = {
  data: FirmWithDetails[];
};

const FirmTable = ({ data }: Props) => {
  const [deleteFirm] = useDeleteFirmMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER (SNACKBAR ONLY) ============ */
  const handleDelete = (firmId: number) => {
    enqueueSnackbar("Are you sure you want to delete this firm?", {
      variant: "warning",
      persist: true,
      action: (snackbarId) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="danger"
            isLoading={deletingId === firmId}
            onClick={async () => {
              try {
                setDeletingId(firmId);
                await deleteFirm(firmId).unwrap();

                enqueueSnackbar("Firm deleted successfully", {
                  variant: "success",
                });
              } catch (err: any) {
                enqueueSnackbar(
                  err?.data?.message || "Failed to delete firm",
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
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Firm Name</th>
            <th className="px-6 py-3">Firm Code</th>
            <th className="px-6 py-3">Contact Person</th>
            <th className="px-6 py-3">Contact Number</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.firmId}
              className={`border-t transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4 text-link">
                <Link href={`/firms/${item.firmId}`}>
                  {item.firmName}
                </Link>
              </td>

              <td className="px-6 py-4">
                {item.firmCode ?? "-"}
              </td>

              <td className="px-6 py-4">
                {item.firmDetails?.contactPerson ?? "-"}
              </td>

              <td className="px-6 py-4">
                {item.firmDetails?.contactNumber ?? "-"}
              </td>

              {/* ===== ACTIONS ===== */}
              <td className="px-6 py-4 text-center space-x-2">
                {/* ✏️ EDIT */}
                <Link href={`/firms/edit/${item.firmId}`}>
                  <Button
                    size="xs"
                    variant="primary"
                    outline
                    startIcon={
                      <Icon
                        name="PencilIcon"
                        className="w-5 h-5"
                      />
                    }
                  >
                    Edit
                  </Button>
                </Link>

                {/* 🗑️ DELETE */}
                <Button
                  size="xs"
                  variant="danger"
                  outline
                  onClick={() => handleDelete(item.firmId)}
                  disabled={deletingId === item.firmId}
                  startIcon={
                    <Icon
                      name="TrashBinIcon"
                      className="w-5 h-5"
                    />
                  }
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
                No firms found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FirmTable;
