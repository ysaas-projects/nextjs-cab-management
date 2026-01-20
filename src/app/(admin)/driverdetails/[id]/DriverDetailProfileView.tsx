"use client";

import { useState } from "react";
import { useSnackbar } from "notistack";

import {
  useGetDriverDetailByIdQuery,
  useUpdateDriverDetailMutation,
} from "@/features/driverdetail";

import Icon from "@/components/atoms/Icon";

/* =======================
   SMALL REUSABLE UI
======================= */

const Tab = ({ label, icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
      ${
        active
          ? "bg-blue-500 text-white shadow"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
  >
    <Icon name={icon} className="w-4 h-4" />
    {label}
  </button>
);

const Section = ({ title, icon, children }: any) => (
  <div>
    <h3 className="text-blue-600 font-semibold mb-3 flex items-center gap-2">
      <Icon name={icon} className="w-5 h-5" />
      {title}
    </h3>

    <div className="bg-white rounded-2xl shadow p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

const InfoCard = ({ label, value }: any) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value || "-"}</p>
  </div>
);

/* =======================
   MAIN PAGE
======================= */

export default function DriverDetailProfilePage({
  driverDetailId,
}: {
  driverDetailId: number;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<"profile">("profile");

  const { data, isLoading, isError } =
    useGetDriverDetailByIdQuery(driverDetailId);

  const [updateDriver, { isLoading: isUpdating }] =
    useUpdateDriverDetailMutation();

  /* -----------------------
     Loading / Error
  ------------------------ */
  if (isLoading) return <p className="p-6">Loading...</p>;

  if (isError || !data)
    return (
      <p className="p-6 text-red-500">
        Failed to load driver details
      </p>
    );

  /* -----------------------
     Toggle Active Status
  ------------------------ */
  const toggleStatus = async () => {
    try {
      await updateDriver({
        driverDetailId: data.driverDetailId,
        driverName: data.driverName!,
        mobileNumber: data.mobileNumber!,
        isActive: !data.isActive,
      }).unwrap();

      enqueueSnackbar(
        `Driver ${
          data.isActive ? "deactivated" : "activated"
        } successfully`,
        { variant: "success" }
      );
    } catch {
      enqueueSnackbar("Failed to update driver status", {
        variant: "error",
      });
    }
  };

  /* -----------------------
     UI
  ------------------------ */
  return (
    <div className="flex gap-6 bg-slate-50 p-6 min-h-screen">
      {/* ================= LEFT PANEL ================= */}
      <div className="w-64 bg-white rounded-2xl shadow p-6">
        <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
          {data.driverName?.[0]}
        </div>

        <p className="mt-4 font-semibold text-lg">
          {data.driverName}
        </p>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm">Status:</span>
          <div
            onClick={!isUpdating ? toggleStatus : undefined}
            className={`cursor-pointer w-10 h-5 rounded-full relative transition
              ${
                data.isActive
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition
                ${
                  data.isActive ? "right-1" : "left-1"
                }`}
            />
          </div>
        </div>
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="flex-1 space-y-6">
        {/* Tabs */}
        <div className="bg-white p-4 rounded-2xl shadow flex gap-3">
          <Tab
            label="Profile"
            icon="UserIcon"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <>
            <Section
              title="Driver Information"
              icon="UserIcon"
            >
              <InfoCard
                label="Driver Name"
                value={data.driverName}
              />
              <InfoCard
                label="Mobile Number"
                value={data.mobileNumber}
              />
              <InfoCard
                label="Status"
                value={
                  data.isActive ? "Active" : "Inactive"
                }
              />
            </Section>

            <Section
              title="System Information"
              icon="BoxIcon"
            >
              <InfoCard
                label="Created At"
                value={
                  data.createdAt
                    ? new Date(
                        data.createdAt
                      ).toLocaleString()
                    : "-"
                }
              />
              <InfoCard
                label="Updated At"
                value={
                  data.updatedAt
                    ? new Date(
                        data.updatedAt
                      ).toLocaleString()
                    : "-"
                }
              />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
