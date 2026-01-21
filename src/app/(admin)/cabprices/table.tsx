"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useDeleteCabPriceMutation } from "@/features/cabprice";

/* ================= PROPS ================= */
export interface CabPricesTableProps {
  data: {
    cabPriceId: number;
    firmName: string;
    cabType: string;
    pricingRuleId: number;
    pricingRuleName: string;
    price: number;
    isActive: boolean;
    createdAt: string;
  }[];
}

const CabPriceTable = ({ data }: CabPricesTableProps) => {
  const [deleteCabPrice, { isLoading }] = useDeleteCabPriceMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER (SweetAlert) ============ */
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Cab Price?",
      text: "This cab price will be permanently deleted.",
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
      await deleteCabPrice(id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Cab price deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

     
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err?.data?.message || "Failed to delete cab price",
      });

     
    } finally {
      setDeletingId(null);
    }
  };

  /* ============ EMPTY STATE ============ */
  if (data.length === 0) {
    return (
      <div className="border rounded p-6 text-center text-gray-500">
        No cab prices found
      </div>
    );
  }

  /* ============ TABLE ============ */
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Firm</th>
            <th className="px-6 py-3">Cab</th>
            <th className="px-6 py-3">Price Rule</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.cabPriceId}
              onClick={() =>
                (window.location.href = `/cabprices/${item.cabPriceId}`)
              }
              className={`border-t cursor-pointer transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4">{item.firmName}</td>

              <td className="px-6 py-4 text-link">
                {item.cabType}
              </td>

              <td className="px-6 py-4 text-link">
                {item.pricingRuleName}
              </td>

              <td className="px-6 py-4 font-medium">
                ₹{item.price}
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
              <td
                className="px-6 py-4 text-center space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ✏️ EDIT */}
                <Link href={`/cabprices/edit/${item.cabPriceId}`}>
                  <Button
                    size="xs"
                    variant="primary"
                    outline
                    startIcon={
                      <Icon name="PencilIcon" className="w-5 h-5" />
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
                  onClick={() => handleDelete(item.cabPriceId)}
                  disabled={isLoading && deletingId === item.cabPriceId}
                  startIcon={
                    <Icon name="TrashBinIcon" className="w-5 h-5" />
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

export default CabPriceTable;
