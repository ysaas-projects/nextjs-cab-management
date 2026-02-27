"use client";

import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useRouter } from "next/navigation";
import { FirmSpeedPolicy } from "@/features/firmSpeedPolicy/firmSpeedPolicy.types";

type Props = {
    data: FirmSpeedPolicy[];
};

export default function FirmSpeedPolicyTable({ data }: Props) {
    const router = useRouter();

    return (
        <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">Effective From</th>
                        <th className="px-6 py-3">Day Speed</th>
                        <th className="px-6 py-3">Night Speed</th>
                        <th className="px-6 py-3">Grace (min)</th>
                        <th className="px-6 py-3">Min Speed</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                                No speed policies configured
                            </td>
                        </tr>
                    )}

                    {data.map((p) => (
                        <tr key={p.firmSpeedPolicyId} className="border-t">
                            <td className="px-6 py-4">
                                {new Date(p.effectiveFrom).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">{p.dayAvgSpeed} km/hr</td>
                            <td className="px-6 py-4">{p.nightAvgSpeed} km/hr</td>
                            <td className="px-6 py-4">{p.graceMinutes}</td>
                            <td className="px-6 py-4">{p.minChargeableSpeed}</td>

                            <td className="px-6 py-4 text-center">
                                {p.isActive ? (
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
                                        router.push(
                                            `/settings/firm-speed-policies/${p.firmSpeedPolicyId}/edit`
                                        )
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