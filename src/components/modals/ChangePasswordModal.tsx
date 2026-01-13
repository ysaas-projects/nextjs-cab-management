"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useChangePasswordMutation } from "@/features/auth/authApi";


type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({ open, onClose }: Props) {

  const router = useRouter();


  const user = useSelector((state: RootState) => state.auth.user);

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  if (!open) return null;

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      await changePassword({
        userId: user.userId,
        body: { currentPassword, newPassword },
      }).unwrap();


      setSuccess("Password changed successfully 🎉");

      setTimeout(() => {
        logout();
        router.replace("/signin");
      }, 1200);
    } catch (err: any) {
      setError(err?.data || err?.message || "Something went wrong");
    }
  };


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 px-6">{error}</p>}
        {success && <p className="text-sm text-green-600 px-6">{success}</p>}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>

        </div>
      </div>
    </div>
  );
}
