"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { logout } from "@/lib/auth";

import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import ProfileModal from "@/components/modals/ProfileModal";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const user = useSelector(selectAuthUser);
  const router = useRouter();

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    router.replace("/signin");
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400"
        >
          <span className="mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </span>

          <span className="mr-1 font-medium">
            {user?.username || "User"}
          </span>
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="absolute right-0 mt-4 w-[260px] rounded-2xl border bg-white p-3 shadow-lg"
        >
          {/* USER INFO */}
          <div>
            <span className="block font-medium text-gray-700">
              {user?.username}
            </span>
            <span className="block text-sm text-gray-500">
              {user?.email}
            </span>
          </div>

          {/* MENU */}
          <ul className="mt-3 border-t pt-3">
            {/* 🔥 PROFILE POPUP */}
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setOpenProfile(true);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                Profile
              </button>
            </li>

            {/* 🔥 CHANGE PASSWORD POPUP */}
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setOpenChangePassword(true);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                Change Password
              </button>
            </li>

            <li>
              <DropdownItem
                href="/settings"
                onItemClick={() => setIsOpen(false)}
              >
                Settings
              </DropdownItem>
            </li>
          </ul>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </Dropdown>
      </div>

      {/* 🔥 PROFILE MODAL */}
      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />

      {/* 🔥 CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </>
  );
}
