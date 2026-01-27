"use client";

// pricing-rules/table.tsx
import { useState } from "react";
import Link from "next/link";
import { enqueueSnackbar, closeSnackbar } from "notistack";

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
  const [deletePricingRule] = useDeletePricingRuleMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER (SNACKBAR ONLY) ============ */
  const handleDelete = (id: number) => {
    enqueueSnackbar(
      "Are you sure you want to delete this pricing rule?",
      {
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
                  await deletePricingRule(id).unwrap();

                  enqueueSnackbar(
                    "Pricing rule deleted successfully",
                    { variant: "success" }
                  );
                } catch (err: any) {
                  enqueueSnackbar(
                    err?.data?.message ||
                      "Failed to delete pricing rule",
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
      }
    );
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
              className={`border-t transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4">
                {item.firmName}
              </td>

              {/* ✅ VIEW LIKE CAB (Link) */}
              <td className="px-6 py-4 text-link">
                <Link href={`/pricing-rules/${item.pricingRuleId}`}>
                  {item.ruleDetails}
                </Link>
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

              {/* ===== ACTIONS ===== */}
              <td className="px-6 py-4 text-center space-x-2">
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
                  onClick={() =>
                    handleDelete(item.pricingRuleId)
                  }
                  disabled={deletingId === item.pricingRuleId}
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
                colSpan={5}
                className="px-6 py-4 text-center text-gray-500"
              >
                No pricing rules found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PricingRuleTable;
