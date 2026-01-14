"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import { useDeleteFirmMutation } from "@/features/firm/firmApi";
import { enqueueSnackbar, closeSnackbar } from "notistack";

type Props = {
    data: {
        id: number;
        firmName: string;
        firmCode: string;
        isActive: boolean;
    }[];
};

const FirmTable = ({ data }: Props) => {
    const [deleteFirm, { isLoading }] = useDeleteFirmMutation();

    const handleDeleteConfirm = (id: number) => {
        enqueueSnackbar("Are you sure you want to delete this firm?", {
            variant: "warning",
            persist: true,
            action: (snackbarId) => (
                <div className="flex gap-2">
                    <Button
                        size="xs"
                        variant="danger"
                        onClick={async () => {
                            try {
                                await deleteFirm(id).unwrap();

                                enqueueSnackbar("Firm deleted successfully", {
                                    variant: "success",
                                });
                            } catch (err: any) {
                                enqueueSnackbar(
                                    err?.data?.message || "Failed to delete firm",
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
                        <th className="px-6 py-3">Firm Name</th>
                        <th className="px-6 py-3">Firm Code</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-t hover:bg-red-150 transition ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-800">
                                {index + 1}
                            </td>

                            <td className="px-6 py-4 text-link">
                                <Link href={`/firms/${item.id}`}>
                                    {item.firmName}
                                </Link>
                            </td>

                            <td className="px-6 py-4">{item.firmCode}</td>

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
                                {/* Edit */}
                                <Link href={`/firms/edit/${item.id}`}>
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

                                {/* Delete */}
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

export default FirmTable;
