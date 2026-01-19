"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { useDeleteFirmTermMutation } from "@/features/firmTerms";

// ✅ Table-specific type (IMPORTANT)
type FirmTermRow = {
  id: number;
  firmId: number;
  description: string;
  isActive: boolean;
};

type Props = {
  data: FirmTermRow[];
};

const FirmTermTable = ({ data }: Props) => {
  const [deleteFirmTerm] = useDeleteFirmTermMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this firm term?")) return;
    await deleteFirmTerm(id);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Firm ID</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`border-t hover:bg-gray-100 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {index + 1}
              </td>

              <td className="px-6 py-4">{item.firmId}</td>

              <td className="px-6 py-4">{item.description}</td>

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
                <Link href={`/firmTerms/edit/${item.id}`}>
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

                <Button
                  size="xs"
                  variant="danger"
                  outline
                  onClick={() => handleDelete(item.id)}
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
              <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                No firm terms found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FirmTermTable;
