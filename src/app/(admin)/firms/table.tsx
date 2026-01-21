"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { FirmWithDetails } from "@/features/firm";
import { useDeleteFirmMutation } from "@/features/firm/firmApi";

type Props = {
  data: FirmWithDetails[];
};

const FirmTable = ({ data }: Props) => {
  const [deleteFirm, { isLoading }] = useDeleteFirmMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER ============ */
  const handleDelete = async (firmId: number) => {
    const result = await Swal.fire({
      title: "Delete Firm?",
      text: "This firm will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(firmId);
      await deleteFirm(firmId).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Firm deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

    
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err?.data?.message || "Failed to delete firm",
      });

    } finally {
      setDeletingId(null);
    }
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
                  disabled={isLoading && deletingId === item.firmId}
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
        </tbody>
      </table>
    </div>
  );
};

export default FirmTable;
