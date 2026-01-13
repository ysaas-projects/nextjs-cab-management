import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";

type Props = {
    data: {
        id: number;
        millName: string;
        location: string;
        contactPerson: string;
    }[];
};

const MillTable = ({ data }: Props) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="px-6 py-3">Sr. No.</th>
                        <th className="px-6 py-3">Mill Name</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Contact Person</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-t hover:bg-red-150 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-800">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 text-link"><Link href={`/mills/${item.id}`}>{item.millName}</Link></td>
                            <td className="px-6 py-4">{item.location}</td>
                            <td className="px-6 py-4">{item.contactPerson}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                                <Link href={`/mills/edit/${item.id}`}>
                                    <Button
                                        size="xs"
                                        variant="primary"
                                        outline
                                        startIcon={<Icon name="PencilIcon"  className="w-5 h-5" />}
                                    >
                                        Edit
                                    </Button>

                                </Link>
                                {/* <Button
                                    size="xs"
                                    variant="danger"
                                    outline
                                    startIcon={<Icon name="TrashBinIcon"  className="w-5 h-5" />}
                                >
                                    Delete
                                </Button> */}


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MillTable;
