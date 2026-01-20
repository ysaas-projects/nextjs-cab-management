import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { useDeleteDriverDetailMutation } from "@/features/driverdetail";
import { enqueueSnackbar } from "notistack";

type Props = {
  data: {
    id: number;
    driverName: string;
    mobileNumber: string;
    status: string;
  }[];
};

const DriverDetailsTable = ({ data }: Props) => {
  const [deleteDriver] = useDeleteDriverDetailMutation();

const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this driver?"
  );

  if (!confirmDelete) return;

  try {
    await deleteDriver(id).unwrap();

    enqueueSnackbar("Driver deleted successfully", {
      variant: "success",
    });
  } catch {
    enqueueSnackbar("Failed to delete driver", {
      variant: "error",
    });
  }
};
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
     <Link href={`/driverdetails/edit/${item.id}`}>
      <Button
      size="xs"
      variant="primary"
      outline
      >
      Edit
      </Button>
     </Link>

    <Button
    size="xs"
    variant="danger"
    outline
    onClick={() => handleDelete(item.id)}
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

export default DriverDetailsTable;
