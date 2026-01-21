"use client";

// pricing-rules/table.tsx
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useDeletePricingRuleMutation } from "@/features/pricingRule";

type Props = {
  data: {
    pricingRuleId: number;
    firmId: number;
    firmName: string;
    ruleDetails: string;
    isActive: boolean;
  }[];
};

const PricingRuleTable = ({ data }: Props) => {
  const [deletePricingRule, { isLoading }] =
    useDeletePricingRuleMutation();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Pricing Rule?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);

      await deletePricingRule(id).unwrap();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Pricing rule deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          err?.data?.message ||
          "Failed to delete pricing rule",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Firm</th>
            <th className="px-6 py-3">Rule Details</th>
            <th className="px-6 py-3">Active</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.pricingRuleId}
              onClick={() =>
                (window.location.href =
                  `/pricing-rules/${item.pricingRuleId}`)
              }
              className={`border-t cursor-pointer transition ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4">
                {item.firmName}
              </td>

              <td className="px-6 py-4 text-link">
                {item.ruleDetails}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Yes" : "No"}
                </span>
              </td>

              {/* ACTIONS */}
              <td
                className="px-6 py-4 text-center space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ✏️ EDIT */}
                <Link
                  href={`/pricing-rules/edit/${item.pricingRuleId}`}
                >
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
                  startIcon={
                    <Icon
                      name="TrashBinIcon"
                      className="w-5 h-5"
                    />
                  }
                  isLoading={
                    isLoading &&
                    deletingId === item.pricingRuleId
                  }
                  onClick={() =>
                    handleDelete(item.pricingRuleId)
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

export default PricingRuleTable;
