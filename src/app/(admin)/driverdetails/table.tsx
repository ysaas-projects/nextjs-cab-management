"use client";

import { useState } from "react";
import Link from "next/link";
import { enqueueSnackbar, closeSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useDeleteDriverDetailMutation } from "@/features/driverdetail";

type Props = {
  data: {
    id: number;
    driverName: string;
    mobileNumber: string;
    firmName: string;   // ✅ NEW
    userName: string;   // ✅ NEW
    status: string;
  }[];
};

const DriverDetailsTable = ({ data }: Props) => {
  const [deleteDriver] = useDeleteDriverDetailMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ================= DELETE (SNACKBAR ONLY) ================= */
  const handleDelete = (id: number) => {
    enqueueSnackbar("Are you sure you want to delete this driver?", {
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
                await deleteDriver(id).unwrap();

                enqueueSnackbar("Driver deleted successfully", {
                  variant: "success",
                });
              } catch {
                enqueueSnackbar("Failed to delete driver", {
                  variant: "error",
                });
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

  /* ================= TABLE ================= */
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr.No</th>
            <th className="px-6 py-3">Driver Name</th>
            <th className="px-6 py-3">Mobile Number</th>
            <th className="px-6 py-3">Firm</th>        
            <th className="px-6 py-3">User</th>        
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              onClick={() =>
                (window.location.href = `/driverdetails/${item.id}`)
              }
              className={`border-t cursor-pointer transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {item.id}
              </td>

              <td className="px-6 py-4">{item.driverName}</td>

              <td className="px-6 py-4">{item.mobileNumber}</td>

              <td className="px-6 py-4">{item.firmName}</td>

              <td className="px-6 py-4">{item.userName}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              {/* ===== ACTIONS ===== */}
              <td
                className="px-6 py-4 text-center space-x-2"
                onClick={(e) => e.stopPropagation()} // ✅ prevent row click
              >
                {/* ✏️ EDIT */}
                <Link href={`/driverdetails/edit/${item.id}`}>
                  <Button size="xs" variant="primary" outline>
                    Edit
                  </Button>
                </Link>

                {/* 🗑️ DELETE */}
                <Button
                  size="xs"
                  variant="danger"
                  outline
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-4 text-center text-gray-500"
              >
                No drivers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverDetailsTable;
