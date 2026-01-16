"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { useDeleteFirmTermMutation } from "@/features/firmTerm/firmTermApi";

type Props = {
    data: {
        id: number;
        srNo: number;
        firmId: number;
        description: string;
        isActive: boolean;
    }[];
};

const FirmTermTable = ({ data }: Props) => {
    const [deleteFirmTerm, { isLoading }] = useDeleteFirmTermMutation();

    const handleDeleteConfirm = (id: number) => {
        enqueueSnackbar("Are you sure you want to delete this firm term?", {
            variant: "warning",
            persist: true,
            action: (snackbarId) => (
                <div className="flex gap-2">
                    <Button
                        size="xs"
                        variant="danger"
                        onClick={async () => {
                            try {
                                await deleteFirmTerm(id).unwrap();

                                enqueueSnackbar("Firm term deleted successfully", {
                                    variant: "success",
                                });
                            } catch (err: any) {
                                enqueueSnackbar(
                                    err?.data?.message || "Failed to delete firm term",
                                    { variant: "error" }
                                );
                            } finally {
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
        });
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="px-6 py-3">Sr. No.</th>
                        <th className="px-6 py-3">Firm Id</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="border-t hover:bg-red-150 transition"
                        >
                            <td className="px-6 py-4 font-medium text-gray-800">
                                {item.srNo}
                            </td>

                            <td className="px-6 py-4">{item.firmId}</td>

                            <td className="px-6 py-4 text-link">
                                <Link href={`/firm-terms/${item.id}`}>
                                    {item.description}
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
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-center space-x-2">
                                <Link href={`/firm-terms/edit/${item.id}`}>
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
                                    isLoading={isLoading}
                                    onClick={() => handleDeleteConfirm(item.id)}
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
                </tbody>
            </table>
        </div>
    );
};

export default FirmTermTable;
