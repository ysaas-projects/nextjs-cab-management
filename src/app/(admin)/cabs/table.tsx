"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useDeleteCabMutation } from "@/features/cab/cabApi";

/* ================= PROPS ================= */
type Props = {
  data: {
    id: number;
    cabType: string;
    firmName: string;
    isActive: boolean;
  }[];
};

const CabTable = ({ data }: Props) => {
  const [deleteCab, { isLoading }] = useDeleteCabMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER (SweetAlert) ============ */
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Cab?",
      text: "This cab will be permanently deleted.",
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
      setDeletingId(id);
      await deleteCab(id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Cab deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err?.data?.message || "Failed to delete cab",
      });

      enqueueSnackbar(
        err?.data?.message || "Failed to delete cab",
        { variant: "error" }
      );
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
            <th className="px-6 py-3">Cab Type</th>
            <th className="px-6 py-3">Firm</th>
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

              <td className="px-6 py-4 text-link">
                <Link href={`/cabs/${item.id}`}>
                  {item.cabType}
                </Link>
              </td>

              <td className="px-6 py-4">
                {item.firmName}
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

              {/* ===== ACTIONS ===== */}
              <td className="px-6 py-4 text-center space-x-2">
                {/* ✏️ EDIT */}
                <Link href={`/cabs/edit/${item.id}`}>
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
                  onClick={() => handleDelete(item.id)}
                  disabled={isLoading && deletingId === item.id}
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

export default CabTable;
