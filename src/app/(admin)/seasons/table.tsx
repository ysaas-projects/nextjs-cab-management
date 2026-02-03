"use client";

import Link from "next/link";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { useDeleteSeasonMutation } from "@/features/season/seasonApi";
import { enqueueSnackbar } from "notistack";

type Props = {
  data: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }[];
};

export default function SeasonTable({ data }: Props) {
  const [deleteSeason] = useDeleteSeasonMutation();

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Season</th>
            <th className="px-4 py-2">Start</th>
            <th className="px-4 py-2">End</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.startDate}</td>
              <td className="px-4 py-2">{item.endDate}</td>
              <td className="px-4 py-2">
                {item.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <Link href={`/seasons/edit/${item.id}`}>
                  <Button size="xs" variant="primary" outline>
                    Edit
                  </Button>
                </Link>

                <Button
                  size="xs"
                  variant="danger"
                  outline
                  onClick={async () => {
                    await deleteSeason(item.id).unwrap();
                    enqueueSnackbar("Season deleted", { variant: "success" });
                  }}
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
}
