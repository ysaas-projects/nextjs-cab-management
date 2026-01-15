import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { FirmWithDetails } from "@/features/firm";

type Props = {
  data: FirmWithDetails[];
};

const FirmTable = ({ data }: Props) => {
  
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Firm Name</th>
            <th className="px-6 py-3">Firm Code</th>
            <th className="px-6 py-3">Contact Person</th>
            <th className="px-6 py-3">Contact Number</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
  {data.map((item, index) => {
    console.log("ROW 👉", item); // 👈 इथेच टाकायचं

    return (
      <tr
        key={item.firmId}
        className={`border-t hover:bg-gray-100 transition ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
        }`}
      >
        <td className="px-6 py-4 font-medium text-gray-800">
          {index + 1}
        </td>

        <td className="px-6 py-4 text-link">
          <Link href={`/firms/${item.firmId}`}>
            {item.firmName}
          </Link>
        </td>

        <td className="px-6 py-4">
          {item.firmCode ?? "-"}
        </td>

        <td className="px-6 py-4">
          {item.firmDetails?.contactPerson ?? "-"}
        </td>

        <td className="px-6 py-4">
          {item.firmDetails?.contactNumber ?? "-"}
        </td>

        <td className="px-6 py-4 text-center space-x-2">
          <Link href={`/firms/edit/${item.firmId}`}>
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
        </td>
      </tr>
    );
  })}
</tbody>

      </table>
    </div>
  );
};

export default FirmTable;
