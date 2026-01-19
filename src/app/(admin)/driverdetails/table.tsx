import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";

type Props = {
  data: {
    id: number;
    driverName: string;
    mobileNumber: string;
    status: string;
  }[];
};

const DriverDetailsTable = ({ data }: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Driver Name</th>
            <th className="px-6 py-3">Mobile Number</th>
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
                {item.id}
              </td>

              <td className="px-6 py-4">{item.driverName}</td>

              <td className="px-6 py-4">{item.mobileNumber}</td>

              <td className="px-6 py-4">{item.status}</td>

              <td className="px-6 py-4 text-center space-x-2">
                <Link href={`/admin/driverdetails/edit/${item.id}`}>
                  <Button
                    size="xs"
                    variant="primary"
                    outline
                    startIcon={<Icon name="PencilIcon" className="w-5 h-5" />}
                  >
                    Edit
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverDetailsTable;
