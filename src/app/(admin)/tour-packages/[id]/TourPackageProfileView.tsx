// "use client";

// // src/app/(admin)/tour-packages/[id]/TourPackageProfilePage.tsx

// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Button from "@/components/atoms/Button";
// import Link from "next/link";

// import { useGetTourPackageByIdQuery } from "@/features/tourpackage/tourpackageApi";

// type Props = {
//   packageId: number;
// };

// export default function TourPackageProfileView({ packageId }: Props) {
//   const { data, isLoading, isError } =
//     useGetTourPackageByIdQuery(packageId);

//   if (isLoading) return <div>Loading tour package...</div>;
//   if (isError || !data?.data)
//     return <div>Tour package not found.</div>;

//   const pkg = data.data;

//   return (
//     <>
//       <PageBreadcrumb pageTitle="Tour Package Details" />

//       <div className="space-y-6">
//         <ComponentCard
//           title="Tour Package Information"
//           action={
//             <div className="flex gap-2">
//               <Link href={`/tour-packages/edit/${pkg.packageId}`}>
//                 <Button variant="primary" size="sm">
//                   Edit
//                 </Button>
//               </Link>

//               <Link href="/tour-packages">
//                 <Button variant="default" size="sm">
//                   Back
//                 </Button>
//               </Link>
//             </div>
//           }
//         >
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             {/* BASIC INFO */}
//             <InfoItem
//               label="Package Name"
//               value={pkg.packageName}
//             />

//             <InfoItem
//               label="Location"
//               value={pkg.location ?? "—"}
//             />

//             {/* DURATION (SEPARATE FIELDS) */}
//             <InfoItem
//               label="Duration (Days)"
//               value={pkg.durationDays}
//             />

//             <InfoItem
//               label="Duration (Nights)"
//               value={pkg.durationNights}
//             />

//             <InfoItem
//               label="Base Price"
//               value={`₹ ${pkg.basePrice}`}
//             />

//             <InfoItem
//               label="Description"
//               value={pkg.description ?? "—"}
//             />

//             <InfoItem
//               label="Status"
//               value={<StatusBadge isActive={pkg.isActive} />}
//             />

//             <InfoItem
//               label="Created At"
//               value={formatDate(pkg.createdAt)}
//             />

//             <InfoItem
//               label="Updated At"
//               value={formatDate(pkg.updatedAt)}
//             />
//           </div>
//         </ComponentCard>
//       </div>
//     </>
//   );
// }

// /* ================= HELPERS ================= */

// const InfoItem = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: React.ReactNode;
// }) => (
//   <div>
//     <p className="text-xs uppercase tracking-wide text-gray-500">
//       {label}
//     </p>
//     <p className="mt-1 text-sm font-medium text-gray-900">
//       {value}
//     </p>
//   </div>
// );

// const StatusBadge = ({ isActive }: { isActive: boolean }) => (
//   <span
//     className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//       isActive
//         ? "bg-green-100 text-green-700"
//         : "bg-red-100 text-red-700"
//     }`}
//   >
//     {isActive ? "Active" : "Inactive"}
//   </span>
// );

// const formatDate = (date?: string | null) => {
//   if (!date) return "—";
//   return new Date(date).toLocaleString();
// };
