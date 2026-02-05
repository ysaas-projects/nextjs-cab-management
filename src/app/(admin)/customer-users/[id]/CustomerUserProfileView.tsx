    "use client";
// /customer-users/[id]/CustomerUserProfileView.tsx

import { useMemo } from "react";
import Link from "next/link";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/atoms/Button";

import { useGetCustomerUserByIdQuery } from "@/features/customerUser";
import { useGetCustomersQuery } from "@/features/customer/customerApi";

type Props = {
  customerUserId: number;
};

export default function CustomerUserProfileView({ customerUserId }: Props) {
  const {
    data: customerUser,
    isLoading,
    isError,
  } = useGetCustomerUserByIdQuery(customerUserId, {
    skip: !customerUserId,
    refetchOnMountOrArgChange: true,
  });

  const { data: customers } = useGetCustomersQuery();
  const customerNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of customers ?? []) {
      map.set(c.customerId, c.customerName);
    }
    return map;
  }, [customers]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !customerUser) return <div>Customer user not found.</div>;

  const customerName =
    customerNameById.get(customerUser.customerId) ?? "—";

  return (
    <>
      <PageBreadcrumb pageTitle="Customer User Details" />

      <div className="space-y-6">
        <ComponentCard
          title="Customer User Information"
          action={
            <div className="flex gap-2">
              <Link href="/customer-users">
                <Button variant="primary" size="sm">
                  Back
                </Button>
              </Link>
              <Link href={`/customer-users/edit/${customerUser.customerUserId}`}>
                <Button variant="default" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoItem label="User Name" value={customerUser.userName} />
            <InfoItem
              label="Mobile Number"
              value={customerUser.mobileNumber ?? "—"}
            />

            <InfoItem
              label="Customer"
              value={
                <>
                  <span className="font-medium text-gray-900">{customerName}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    (ID: {customerUser.customerId})
                  </span>
                </>
              }
            />

            <InfoItem
              label="Status"
              value={<StatusBadge isActive={customerUser.isActive} />}
            />

            <InfoItem
              label="Created At"
              value={formatDate(customerUser.createdAt)}
            />
            <InfoItem
              label="Updated At"
              value={formatDate(customerUser.updatedAt ?? undefined)}
            />
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
  </div>
);

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};
