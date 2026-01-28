"use client";

import CabNumberDirectory from "./directory";

export default function CabNumberDirectoryPage() {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-xl font-semibold mb-4">
        Cab Number Directory
      </h1>

      {/* Content */}
      <CabNumberDirectory />
    </div>
  );
}
