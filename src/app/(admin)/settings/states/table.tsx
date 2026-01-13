"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useDeleteStateMutation } from "@/features/states/stateApi";
import { useState } from "react";

type StateRow = {
    id: number;
    stateName: string;
    country: string;
};

type Props = {
    data: StateRow[];
};

const StateTable = ({ data }: Props) => {
    const router = useRouter();
    const [deleteState, { isLoading }] = useDeleteStateMutation();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this state?")) return;

        try {
            setDeletingId(id);
            await deleteState(id).unwrap();

            enqueueSnackbar("State deleted successfully", {
                variant: "success",
            });
        } catch {
            enqueueSnackbar("Failed to delete state", {
                variant: "error",
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="px-6 py-3">Sr. No.</th>
                        <th className="px-6 py-3">State Name</th>
                        <th className="px-6 py-3">Country</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                                No states found
                            </td>
                        </tr>
                    )}

                    {data.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-t hover:bg-gray-50 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-800">
                                {index + 1}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                                {item.stateName}
                            </td>

                            <td className="px-6 py-4">{item.country}</td>

                            <td className="px-6 py-4 text-center space-x-2">
                                <Button
                                    size="xs"
                                    variant="primary"
                                    outline
                                    startIcon={<Icon name="PencilIcon" className="w-5 h-5" />}
                                    onClick={() =>
                                        router.push(`/settings/states/edit/${item.id}`)
                                    }
                                >
                                    Edit
                                </Button>

                                {/* <Button
                                    size="xs"
                                    variant="danger"
                                    outline
                                    disabled={isLoading && deletingId === item.id}
                                    startIcon={<Icon name="TrashBinIcon" className="w-5 h-5" />}
                                    onClick={() => handleDelete(item.id)}
                                >
                                    {deletingId === item.id ? "Deleting..." : "Delete"}
                                </Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StateTable;
