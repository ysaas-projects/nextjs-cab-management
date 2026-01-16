"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useDeleteCabPriceMutation } from "@/features/cabprice";
import { useState } from "react";

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

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cab price?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteCabPrice(id).unwrap();
      enqueueSnackbar("Cab price deleted successfully", {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(
        err?.data?.message || "Failed to delete cab price",
        { variant: "error" }
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (data.length === 0) {
    return (
      <div className="border rounded p-6 text-center text-gray-500">
        No cab prices found
      </div>
    );
  }

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
