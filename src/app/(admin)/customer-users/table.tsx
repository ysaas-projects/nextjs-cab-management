"use client";

import { useState } from "react";
import Link from "next/link";
import { enqueueSnackbar, closeSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";

import { useDeleteCustomerUserMutation } from "@/features/customerUser";

type Props = {
  data: {
    id: number;
    srNo: number;
    customerId: number;
    customerName: string;
    userName: string;
    mobileNumber: string;
    isActive: boolean;
  }[];
};

export default function CustomerUserTable({ data = [] }: Props) {
  const [deleteCustomerUser] = useDeleteCustomerUserMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    enqueueSnackbar("Are you sure you want to delete this customer user?", {
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
                await deleteCustomerUser(id).unwrap();

                enqueueSnackbar("Customer user deleted successfully", {
                  variant: "success",
                });
              } catch (err: any) {
                enqueueSnackbar(
                  err?.data?.message || "Failed to delete customer user",
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

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">User Name</th>
            <th className="px-6 py-3">Mobile</th>
            <th className="px-6 py-3">Customer</th>
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
              <td className="px-6 py-4 font-medium text-gray-800">{item.srNo}</td>

              <td className="px-6 py-4 text-link">
                <Link href={`/customer-users/${item.id}`}>{item.userName}</Link>
              </td>

              <td className="px-6 py-4">{item.mobileNumber}</td>

              <td className="px-6 py-4">
                <div className="font-medium text-gray-800">{item.customerName}</div>
                <div className="text-xs text-gray-500">ID: {item.customerId}</div>
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

              <td className="px-6 py-4 text-center space-x-2">
                <Link href={`/customer-users/edit/${item.id}`}>
                  <Button
                    size="xs"
                    variant="primary"
                    outline
                    startIcon={<Icon name="PencilIcon" className="w-5 h-5" />}
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
                  startIcon={<Icon name="TrashBinIcon" className="w-5 h-5" />}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No customer users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
