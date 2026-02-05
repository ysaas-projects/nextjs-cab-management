"use client";

import Link from "next/link";
import { useState } from "react";
import { enqueueSnackbar, closeSnackbar } from "notistack";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import {
  PackagePricing,
  useDeletePackagePricingMutation,
} from "@/features/packagepricing";

/* ================= PROPS ================= */
type Props = {
  data: PackagePricing[];
};

const PackagePricingTable = ({ data }: Props) => {
  const [deletePricing] = useDeletePackagePricingMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ============ DELETE HANDLER ============ */
  const handleDelete = (pricingId: number) => {
    enqueueSnackbar(
      "Are you sure you want to delete this package pricing?",
      {
        variant: "warning",
        persist: true,
        action: (snackbarId) => (
          <div className="flex gap-2">
            <Button
              size="xs"
              variant="danger"
              isLoading={deletingId === pricingId}
              onClick={async () => {
                try {
                  setDeletingId(pricingId);
                  await deletePricing(pricingId).unwrap();

                  enqueueSnackbar(
                    "Package pricing deleted successfully",
                    { variant: "success" }
                  );
                } catch (err: any) {
                  enqueueSnackbar(
                    err?.data?.message ||
                      "Failed to delete package pricing",
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

  /* ============ TABLE ============ */
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Package Name</th>
            <th className="px-6 py-3">Day Type</th>
            <th className="px-6 py-3">Price / Person</th>
            <th className="px-6 py-3">Min Persons</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.pricingId}
              className={`border-t transition ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50/50"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4 text-link">
                <Link
                  href={`/package-pricing/${item.pricingId}`}
                >
                  {item.packageName}
                </Link>
              </td>

              <td className="px-6 py-4">
                {item.dayType}
              </td>

              <td className="px-6 py-4">
                ₹ {item.pricePerPerson}
              </td>

              <td className="px-6 py-4">
                {item.minPersons}
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 text-center space-x-2">
                <Link
                  href={`/package-pricing/edit/${item.pricingId}`}
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

                <Button
                  size="xs"
                  variant="danger"
                  outline
                  disabled={deletingId === item.pricingId}
                  onClick={() =>
                    handleDelete(item.pricingId)
                  }
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
                No package pricing found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PackagePricingTable;
