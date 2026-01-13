"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetKycVerificationQuery, useUpdateKycDocumentMutation } from "@/features/kyc";
import type { RootState } from "@/store";

export default function KycUploadsPage() {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId;
  const username = user?.username;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [docNumber, setDocNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const [updateKycDocument, { isLoading: isSaving }] =
    useUpdateKycDocumentMutation();

  // ✅ SAFE HOOK CALL (NO CONDITIONAL)
  const {
    data,
    isLoading,
    isError,
  } = useGetKycVerificationQuery(userId!, {
    skip: !userId,
  });

  // ✅ Redirect only if user not logged in
  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [userId, router]);

  // Prevent rendering until auth resolved
  if (!userId) return null;

  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) return <p>Error loading KYC</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        KYC — <span className="text-blue-600">{data.userName ?? username}</span>
      </h2>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Document Name</th>
              <th className="px-4 py-3">Document NO</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.documents?.map((doc: any, i: number) => (
              <tr key={doc.kycId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{doc.documentTypeName}</td>
                <td className="px-4 py-3">{doc.documentNumber ?? "-"}</td>

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

                <td className="px-4 py-3">{doc.remarks ?? "-"}</td>

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

                <td className="px-4 py-3">
                  <button
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setSelectedDoc(doc);
                      setDocNumber(doc.documentNumber ?? "");
                      setRemarks(doc.remarks ?? "");
                      setFile(null);
                      setOpen(true);
                    }}
                  >
                    {doc.documentPath ? "Replace" : "Upload"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* IMAGE PREVIEW */}
        {previewUrl && (
          <div className="fixed inset-0 z-[9999] bg-black/70 flex items-start justify-center pt-40">

            {/* Close Button */}
            <button
              onClick={() => setPreviewUrl(null)}
              className=" top-4 right-4 z-50 bg-white/90 hover:bg-white text-black px-3 py-1 rounded-md shadow"
            >
              ✕
            </button>

            {/* Image Container */}
            <div className="mt-6 max-h-[400px] overflow-hidden">
              <img
                src={previewUrl}
                alt="Document Preview"
                className="block max-h-[400px] w-auto object-contain"
              />
            </div>
          </div>
        )}



        {/* UPLOAD MODAL */}
        {open && selectedDoc && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDoc.documentTypeName}
              </h3>

              <div className="space-y-3">
                <input
                  className="w-full border rounded p-2"
                  placeholder="Document Number"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />

                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="w-full border rounded p-2"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                <textarea
                  className="w-full border rounded p-2"
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>

                <button
                  disabled={isSaving}
                  onClick={async () => {
                    const form = new FormData();
                    form.append("KycId", selectedDoc.kycId);
                    form.append("DocumentNumber", docNumber ?? "");
                    if (file) form.append("DocumentFile", file);
                    form.append("Status", "Uploaded");
                    form.append("Remarks", remarks ?? "");

                    await updateKycDocument(form);
                    setOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
