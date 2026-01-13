"use client";

import { useGetKycVerificationQuery, useUpdateKycStatusMutation } from "@/features/kyc";
import { useState } from "react";

export default function KYCDocsPage({ userId }: { userId: number }) {

  const { data, isLoading, isError } = useGetKycVerificationQuery(Number(userId));

  const [updateKycStatus, { isLoading: isUpdating }] =
    useUpdateKycStatusMutation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [status, setStatus] = useState<string>("Pending");
  const [remarks, setRemarks] = useState<string>("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (isLoading) return <div className="p-6">Loading…</div>;

  if (isError || !data)
    return (
      <div className="p-6">
        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
          Error loading KYC data. Please try again.
        </div>
      </div>
    );

  return (
    <div className="p-6">

      {/* PAGE HEADER */}
      {/* <div className="mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">
          KYC Verification — <span className="text-blue-600">{data.userName}</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Review & verify submitted KYC documents
        </p>
      </div> */}


      {/*  TABLE CARD */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left font-semibold">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Document NO</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.documents?.length > 0 ? (
                data.documents.map((doc: any, i: number) => (
                  <tr key={doc.kycId} className="border-t hover:bg-gray-50">

                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{doc.documentTypeName}</td>

                    <td className="px-4 py-3 text-gray-700">
                      {doc.documentNumber || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium
                          ${doc.status === "Uploaded"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : doc.status === "Rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {doc.remarks || "-"}
                    </td>

                    {/* 🖼 VIEW BUTTON */}
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


                    {/* VERIFY BUTTON */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setStatus(doc.status || "Pending");
                          setRemarks(doc.remarks || "");
                          setOpenModal(true);
                        }}
                        className="px-4 py-1.5 text-sm font-medium rounded-md 
                          bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                      >
                        Verify
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    No KYC documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          {/* 🖼 IMAGE PREVIEW MODAL */}
          {previewUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">

              <div
                className="absolute inset-0 bg-black/25"
                onClick={() => setPreviewUrl(null)}
              />

              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-3xl p-6">

                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">View Document</h3>

                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-50"
                  >
                    ✕
                  </button>
                </div>

                <div className="border rounded-lg p-2 bg-gray-50">
                  <img
                    src={previewUrl}
                    className="max-h-[75vh] mx-auto object-contain rounded"
                    alt="KYC Document"
                  />
                </div>

              </div>
            </div>
          )}


          {/* ✅ VERIFY MODAL (unchanged) */}
          {openModal && selectedDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">

              <div className="absolute inset-0 bg-black/25" onClick={() => setOpenModal(false)} />

              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg p-6">

                <h3 className="text-lg font-semibold text-gray-800 mb-1">Verify Document</h3>

                <p className="text-sm text-gray-500 mb-4">
                  {selectedDoc.documentTypeName}
                </p>

                <div className="space-y-2 mb-4">
                  {["Pending", "Uploaded", "Rejected", "Verified"].map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value={s}
                        checked={status === s}
                        onChange={() => setStatus(s)}
                        className="accent-blue-600"
                      />
                      {s}
                    </label>
                  ))}
                </div>

                <textarea
                  placeholder="Remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm"
                />

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-1.5 rounded-md border text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={async () => {
                      await updateKycStatus({
                        kycId: selectedDoc.kycId,
                        status,
                        remarks,
                      });
                      setOpenModal(false);
                    }}
                    className="px-4 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {isUpdating ? "Saving..." : "Submit"}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
