"use client";

import { useState } from "react";
import { useSnackbar } from "notistack";
import {
    useGetCompanyDetailsQuery,
    useUpdateCompanyStatusMutation,
} from "@/features/company/companyApi";
import Icon from "@/components/atoms/Icon";
import KYCDocsPage from "@/app/(admin)/kyc-documents/verify/[userId]/page";





/* =======================
   SMALL REUSABLE COMPONENTS
======================= */

const Tab = ({ label, icon, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
        ${active ? "bg-blue-500 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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

const InfoRow = ({ label, value }: any) => (
    <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-medium">{value || "-"}</span>
    </div>
);

/* =======================
   USERS TABLE
======================= */

const CompanyUsersTable = ({ users }: any) => (
    <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
            <Icon name="UserIcon" className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-600">Company Users</h2>
        </div>

        <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left">User ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.userId} className="border-b last:border-0">
                            <td className="px-4 py-3">{u.userId}</td>
                            <td className="px-4 py-3">{u.userName}</td>
                            <td className="px-4 py-3">{u.email}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${u.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {u.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

/* =======================
   KYC TABLE
======================= */

// const KYCDocumentsTable = ({ documents }: any) => (
//     <div className="bg-white rounded-2xl shadow p-6 mt-6">
//         <div className="flex items-center gap-2 mb-4">
//             <Icon name="FileIcon" className="w-6 h-6 text-blue-600" />
//             <h2 className="text-xl font-semibold text-blue-600">KYC Documents</h2>
//         </div>

//         <div className="overflow-hidden rounded-xl border">
//             <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b">
//                     <tr>
//                         <th className="px-4 py-3">KYC ID</th>
//                         <th className="px-4 py-3">Document</th>
//                         <th className="px-4 py-3">Number</th>
//                         <th className="px-4 py-3">Status</th>
//                         <th className="px-4 py-3">Remarks</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {documents.map((doc: any) => (
//                         <tr key={doc.kycId} className="border-b last:border-0">
//                             <td className="px-4 py-3">{doc.kycId}</td>
//                             <td className="px-4 py-3">{doc.documentType?.documentTypeName}</td>
//                             <td className="px-4 py-3">{doc.documentNumber || "-"}</td>
//                             <td className="px-4 py-3">
//                                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === "Verified"
//                                         ? "bg-green-100 text-green-700"
//                                         : "bg-yellow-100 text-yellow-700"
//                                     }`}>
//                                     {doc.status}
//                                 </span>
//                             </td>
//                             <td className="px-4 py-3">{doc.remarks || "-"}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     </div>
// );


const KYCDocumentsTable = ({ documents, onVerifyClick }: any) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const userId = documents?.[0]?.userId;

    return (
        <>
            <div className="bg-white rounded-2xl shadow p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Icon name="FileIcon" className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-blue-600">
                            KYC Documents
                        </h2>
                    </div>

                    <button
                        onClick={() => onVerifyClick(userId)}
                        className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-full text-sm hover:bg-green-50"
                    >
                        Verify Documents
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left font-semibold">
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Document Name</th>
                                <th className="px-4 py-3">Document Number</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Remarks</th>
                                <th className="px-4 py-3">Document</th>
                            </tr>
                        </thead>

                        <tbody>
                            {documents.map((doc: any, i: number) => (
                                <tr key={doc.kycId} className="border-b last:border-0">
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        {doc.documentType.documentTypeName}
                                    </td>
                                    <td className="px-4 py-3">
                                        {doc.documentNumber ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {doc.status === "Verified" ? (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                <Icon name="CheckCircleIcon" className="w-4 h-4" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                                <Icon name="TimeIcon" className="w-4 h-4" />
                                                Pending
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">{doc.remarks}</td>

                                    <td className="px-4 py-3">
                                        {doc.documentPath ? (
                                            <button
                                                onClick={() => setPreviewUrl(doc.documentPath)}
                                                className="text-blue-600 border border-blue-500 px-3 py-1 rounded-full text-xs hover:bg-blue-50"
                                            >
                                                View
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔹 Image Preview Modal */}
            {previewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/25 transition-opacity"
                        onClick={() => setPreviewUrl(null)}
                    />

                    {/* modal box */}
                    <div className="relative bg-white rounded-xl shadow-2xl 
        border border-gray-100 w-full max-w-3xl p-6 animate-fadeIn">

                        {/* header */}
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                View Document
                            </h3>

                            <button
                                onClick={() => setPreviewUrl(null)}
                                className="px-3 py-1 rounded-md border text-gray-600 
              hover:bg-gray-50 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* image */}
                        <div className="border rounded-lg p-2 bg-gray-50">
                            <img
                                src={previewUrl}
                                alt="KYC Document"
                                className="max-h-[75vh] mx-auto object-contain rounded"
                            />
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};



const KYCTab = ({
    kycDocs,
    onVerifyClick,
    showKycVerification,
    selectedUserId,
    onBack
}: any) => (
    <>
        {!showKycVerification && (
            <KYCDocumentsTable documents={kycDocs} onVerifyClick={onVerifyClick} />
        )}

        {showKycVerification && selectedUserId && (
            <div className="bg-white rounded-2xl shadow p-6 mt-6">

                {/* header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Icon name="FileIcon" className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-blue-600">
                            Verify KYC
                        </h2>
                    </div>

                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-50"
                    >
                        ← Back to KYC List
                    </button>
                </div>

                {/* 👉 Your verification table lives here */}
                <KYCDocsPage userId={selectedUserId} />
            </div>
        )}
    </>
);


/* =======================
   MAIN VIEW
======================= */

export default function CompanyProfileView({ companyId }: { companyId: number }) {
    const [activeTab, setActiveTab] = useState<"profile" | "users" | "documents">("profile");
    const { enqueueSnackbar } = useSnackbar();

    const [showKycVerification, setShowKycVerification] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const { data, isLoading, isError } = useGetCompanyDetailsQuery(companyId);
    const [updateStatus] = useUpdateCompanyStatusMutation();

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError || !data) return <p className="p-6 text-red-500">Failed to load company</p>;

    const { company, users, kycDocs } = data;

    const toggleStatus = async () => {
        try {
            await updateStatus({
                companyId: company.companyId,
                isActive: !company.isActive,
            }).unwrap();

            enqueueSnackbar(
                `Company ${company.isActive ? "deactivated" : "activated"} successfully`,
                { variant: "success" }
            );
        } catch {
            enqueueSnackbar("Failed to update status", { variant: "error" });
        }
    };

    return (
        <div className="flex gap-6 bg-slate-50 p-6 min-h-screen">
            {/* LEFT PANEL */}
            <div className="w-64 bg-white rounded-2xl shadow p-6">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                    {company.companyName?.[0]}
                </div>

                <p className="mt-4 font-semibold text-lg">{company.companyName}</p>
                <p className="text-sm text-gray-500">{company.companyCode}</p>

                <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm">Status:</span>
                    <div
                        onClick={toggleStatus}
                        className={`cursor-pointer w-10 h-5 rounded-full relative transition ${company.isActive ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${company.isActive ? "right-1" : "left-1"
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow flex gap-3">
                    <Tab label="Profile" icon="BoxIcon" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                    <Tab label="Users" icon="UserIcon" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
                    <Tab label="Documents" icon="FileIcon" active={activeTab === "documents"} onClick={() => setActiveTab("documents")} />
                </div>

                {activeTab === "profile" && (
                    <>
                        <Section title="Company Information" icon="BoxIcon">
                            <InfoCard label="Company Name" value={company.companyName} />
                            <InfoCard label="Company Code" value={company.companyCode} />
                            <InfoCard label="Business Type" value={company.businessType} />
                        </Section>

                        <Section title="Contact Information" icon="UserIcon">
                            <InfoRow label="Email" value={company.contactEmail} />
                            <InfoRow label="Phone" value={company.contactPhone} />
                        </Section>

                        <Section title="Address Information" icon="LocationIcon">
                            <InfoRow label="Address" value={company.address} />
                            <InfoRow label="City" value={company.cityName} />
                            <InfoRow label="State" value={company.stateName} />
                            <InfoRow label="Pincode" value={company.pincode} />
                            <InfoRow label="Country" value={company.country} />
                        </Section>
                    </>
                )}

                {activeTab === "users" && <CompanyUsersTable users={users} />}
                {/* {activeTab === "documents" && <KYCDocumentsTable documents={kycDocs} />} */}

                {activeTab === "documents" && (
                    <KYCTab
                        kycDocs={kycDocs}
                        showKycVerification={showKycVerification}
                        selectedUserId={selectedUserId}
                        onVerifyClick={(userId: number) => {
                            setSelectedUserId(userId);
                            setShowKycVerification(true);
                        }}
                        onBack={() => {
                            setShowKycVerification(false);
                            setSelectedUserId(null);
                        }}
                    />
                )}

            </div>
        </div>
    );
}
