import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { Product } from "@/features/product/product.types";

type Props = {
    data: Product[];
};

const ProductTable = ({ data }: Props) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">Product Grade</th>
                        {/* <th className="px-4 py-3">Mill</th> */}
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created At</th>
                        <th className="px-4 py-3">Selling Price</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item.productId}
                            className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                        >
                            <td className="px-4 py-3">{index + 1}</td>

                            <td className="px-4 py-3 font-medium text-link text-blue-600 hover:underline">
                                <Link href={`/products/${item.productId}`}>
                                    {item.productName}
                                </Link>
                            </td>

                            <td className="px-4 py-3">{item.productGrade ?? "-"}</td>

                            {/* <td className="px-4 py-3">
                                {item.millId}
                            </td> */}

                            <td className="px-4 py-3">{item.stockQuantity}</td>

                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {item.status ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </td>

                            <td className="px-4 py-3 font-medium">
                                {item.sellingPrice
                                    ? `₹${item.sellingPrice.toLocaleString()}`
                                    : "-"}
                            </td>

                            <td className="px-4 py-3 text-center space-x-2">
                                <Link href={`/products/edit/${item.productId}`}>
                                    <Button
                                        size="xs"
                                        variant="primary"
                                        outline
                                        startIcon={<Icon name="PencilIcon" className="w-4 h-4" />}
                                    >
                                        Edit
                                    </Button>
                                </Link>

                                <Button
                                    size="xs"
                                    variant="danger"
                                    outline
                                    startIcon={<Icon name="TrashBinIcon" className="w-4 h-4" />}
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

export default ProductTable;
