"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useRouter } from "next/navigation";

type TimeSegmentRow = {
    timeSegmentId: number;
    segmentName: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
};

type Props = {
    data: TimeSegmentRow[];
};

export default function TimeSegmentTable({ data }: Props) {
    const router = useRouter();

    return (
        <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">Segment</th>
                        <th className="px-6 py-3">Start Time</th>
                        <th className="px-6 py-3">End Time</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                                No time segments configured
                            </td>
                        </tr>
                    )}

                    {data.map((item) => (
                        <tr key={item.timeSegmentId} className="border-t">
                            <td className="px-6 py-4 font-medium">
                                {item.segmentName}
                            </td>
                            <td className="px-6 py-4">{item.startTime}</td>
                            <td className="px-6 py-4">{item.endTime}</td>
                            <td className="px-6 py-4 text-center">
                                {item.isActive ? (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                        Active
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs">
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <Button
                                    size="xs"
                                    variant="primary"
                                    outline
                                    startIcon={<Icon name="PencilIcon" className="w-4 h-4" />}
                                    onClick={() =>
                                        router.push(`/settings/time-segments/${item.timeSegmentId}/edit`)
                                    }
                                >
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}