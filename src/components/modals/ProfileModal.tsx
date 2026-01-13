"use client";

import Button from "@/components/atoms/Button";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/features/auth/authSelectors";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  const user = useSelector(selectAuthUser);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Profile Details
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <ProfileRow label="Username" value={user?.username} />
          <ProfileRow label="Email" value={user?.email} />
          <ProfileRow label="Roles" value={user?.roles?.join(", ")} />
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex justify-between rounded-md bg-gray-50 px-4 py-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-800">{value || "-"}</span>
    </div>
  );
}
