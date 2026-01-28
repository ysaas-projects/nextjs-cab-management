"use client";

import { useGetUsersQuery } from "@/features/user/userApi";
import Link from "next/link";

export default function UsersPage() {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <div className="p-6">Loading users...</div>;
console.log(users); // 👈 should now show array
 
  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load users
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>

        <Link
          href="/users/create"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add User
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Firm Type</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((u) => (
              <tr key={u.userId} className="hover:bg-gray-50">
                <td className="p-3 border">{u.userName}</td>
                <td className="p-3 border">{u.email ?? "-"}</td>
                <td className="p-3 border">{u.mobileNumber ?? "-"}</td>
                <td className="p-3 border">{u.firmType ?? "-"}</td>
                <td className="p-3 border">
                  {u.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="p-3 border">
                  <Link
                    href={`/users/${u.userId}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {users?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
