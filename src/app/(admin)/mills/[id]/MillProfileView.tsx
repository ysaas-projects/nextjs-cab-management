"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon";
import { useGetMillDetailsQuery, useUpdateMillStatusMutation } from "@/features/mill/millApi";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import KYCDocsPage from "@/app/(admin)/kyc-documents/verify/[userId]/page";
import { Product } from "@/features/mill";


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

const MillUsersTable = ({ users }: any) => {
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon name="GroupIcon" className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-600">Mill Users</h2>
            </div>

            <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-left font-semibold">
                            <th className="px-4 py-3">User ID</th>
                            <th className="px-4 py-3">User Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.userId} className="border-b last:border-0">
                                <td className="px-4 py-3">{user.userId}</td>
                                <td className="px-4 py-3">{user.userName}</td>
                                <td className="px-4 py-3">{user.email || "-"}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                        <Icon name="CheckCircleIcon" className="w-4 h-4" />
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


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
                                <th className="px-4 py-3">KYC ID</th>
                                <th className="px-4 py-3">Document Name</th>
                                <th className="px-4 py-3">Document Number</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Remarks</th>
                                <th className="px-4 py-3">Document</th>
                            </tr>
                        </thead>

                        <tbody>
                            {documents.map((doc: any) => (
                                <tr key={doc.kycId} className="border-b last:border-0">
                                    <td className="px-4 py-3">{doc.kycId}</td>
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





/* =======================
   TABS CONTENT
======================= */

const ProfileTab = ({ mill }: any) => (
    <>
        <Section title="Mill Information" icon="BoxIcon">
            <InfoCard label="Mill Name" value={mill.millName} />
            <InfoCard label="Mill Code" value={mill.millCode} />
            <InfoCard label="GST Number" value={mill.gstNumber} />
        </Section>

        <Section title="Contact Information" icon="UserIcon">
            <InfoRow label="Contact Person" value={mill.contactPerson} />
            <InfoRow label="Contact Number" value={mill.contactNumber} />
            <InfoRow label="Email" value={mill.email} />
        </Section>

        <Section title="Address Details" icon="LocationIcon">
            <InfoRow label="Address" value={mill.address} />
            <InfoRow label="State" value={mill.stateName} />
            <InfoRow label="City" value={mill.cityName} />
            <InfoRow label="Pincode" value={mill.pincode} />
        </Section>
    </>
);

const UsersTab = ({ users }: any) => (
    <MillUsersTable users={users} />

);

// const KYCTab = ({ kycDocs }: any) => (
//     <KYCDocumentsTable documents={kycDocs} />
// );

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


const ProductsTab = ({ products }: { products: Product[] }) => {
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon name="BoxCubeIcon" className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-600">
                    Products
                </h2>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500">No products available</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left font-semibold">
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Grade</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Images</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((p) => (
                                <tr key={p.productId} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-medium">
                                        {p.productName}
                                    </td>

                                    <td className="px-4 py-3">
                                        {p.productGrade || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {p.stockQuantity}
                                    </td>

                                    <td className="px-4 py-3">
                                        ₹{p.sellingPrice ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {p.status ? (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {p.images?.length > 0 ? (
                                            <div className="flex gap-2">
                                                {p.images.slice(0, 3).map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img.productImagePath}
                                                        alt="product"
                                                        className="w-10 h-10 rounded object-cover border"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


/* =======================
   MAIN PAGE
======================= */

export default function MillProfileView({ millId }: { millId: number }) {
    const [activeTab, setActiveTab] = useState("profile");


    const [showKycVerification, setShowKycVerification] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const { data, isLoading, isError } = useGetMillDetailsQuery(millId);
    const [updateStatus, { isLoading: updating }] = useUpdateMillStatusMutation();

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError || !data) return <p className="p-6 text-red-500">Failed to load mill data</p>;

    const { mill, users, kycDocs, products } = data;

    const handleToggleStatus = async () => {
        try {
            await updateStatus({
                millId: mill.millId,
                isActive: !mill.isActive,
            }).unwrap();

            enqueueSnackbar(
                `Mill ${!mill.isActive ? "activated" : "deactivated"} successfully`,
                { variant: "success" }
            );
        } catch (error) {
            enqueueSnackbar("Failed to update status", { variant: "error" });
        }
    };


    return (
        <div className="flex gap-6 bg-slate-50 p-6 min-h-screen">

            {/* LEFT SIDEBAR */}
            <div className="w-64 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-xl text-xl font-bold">
                    {mill.millName?.[0]}
                </div>

                <p className="mt-4 font-semibold text-lg">{mill.millName}</p>

                <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm font-medium">Active Status:</span>
                    <div
                        onClick={handleToggleStatus}
                        className={`cursor-pointer w-10 h-5 rounded-full relative transition ${mill.isActive ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${mill.isActive ? "right-1" : "left-1"
                                }`}
                        />
                    </div>

                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-2xl p-4 flex gap-3 shadow">
                    <Tab label="Mill Profile" icon="BoxIcon" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                    <Tab label="Users" icon="GroupIcon" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
                    <Tab label="KYC Details" icon="FileIcon" active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} />
                    <Tab label="Products" icon="BoxCubeIcon" active={activeTab === "products"} onClick={() => setActiveTab("products")} />
                </div>

                {activeTab === "profile" && <ProfileTab mill={mill} />}
                {activeTab === "users" && <UsersTab users={users} />}
                {/* {activeTab === "kyc" && <KYCTab kycDocs={kycDocs} />} */}
                {activeTab === "kyc" && (
                    <KYCTab
                        kycDocs={kycDocs}
                        showKycVerification={showKycVerification}
                        selectedUserId={selectedUserId}
                        onVerifyClick={(userId: number) => {
                            setSelectedUserId(userId);
                            setShowKycVerification(true);   // always open verification
                        }}
                        onBack={() => {
                            setShowKycVerification(false);  // go back to table
                            setSelectedUserId(null);
                        }}
                    />
                )}


                {activeTab === "products" && <ProductsTab products={products} />}
            </div>
        </div>
    );
}
