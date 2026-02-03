"use client";

import Link from "next/link";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useState } from "react";
import { enqueueSnackbar, closeSnackbar } from "notistack";

import { useDeleteTourPackageMutation } from "@/features/tourpackage/tourpackageApi";

/* ================= PROPS ================= */
type Props = {
  data: {
    id: number;
    name: string;
    basePrice: number;
    minPersons: number;
    isActive: boolean;
  }[];
};

const TourPackageTable = ({ data }: Props) => {
  const [deletePackage] = useDeleteTourPackageMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER ============ */
  const handleDelete = (id: number) => {
    enqueueSnackbar("Are you sure you want to delete this tour package?", {
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
                await deletePackage(id).unwrap();

                enqueueSnackbar("Tour package deleted successfully", {
                  variant: "success",
                });
              } catch (err: any) {
                enqueueSnackbar(
                  err?.data?.message || "Failed to delete tour package",
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
            <th className="px-6 py-3">Package Name</th>
            <th className="px-6 py-3">Base Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={`border-t transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-gray-100`}>
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4 text-link">
                <Link href={`/tour-packages/${item.id}`}>
                  {item.name}
                </Link>
              </td>

              <td className="px-6 py-4">₹ {item.basePrice}</td>


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
                <Link href={`/tour-packages/edit/${item.id}`}>
                  <Button
  size="xs"
  variant="primary"
  outline
  startIcon={<Icon name="PencilIcon" className="w-5 h-5" />}
  onClick={() => {
    console.log("EDIT CLICK ID:", item.id);
  }}
>
  Edit
</Button>
                </Link>

                <Button
                  size="xs"
                  variant="danger"
                  outline
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  startIcon={
                    <Icon name="TrashBinIcon" className="w-5 h-5" />
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No tour packages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TourPackageTable;
