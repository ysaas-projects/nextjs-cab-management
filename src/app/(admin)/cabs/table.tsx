"use client";

interface CabPriceRow {
  cabPriceId: number;
  firmName: string;
  cabType: string;
  pricingRuleId: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

interface CabPricesTableProps {
  data: CabPriceRow[];
}

export default function CabPriceTable({ data }: CabPricesTableProps) {
  if (data.length === 0) {
    return (
      <div className="border rounded p-6 text-center text-gray-500">
        No cab prices found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3">Sr. No.</th>
            <th className="px-6 py-3">Firm</th>
            <th className="px-6 py-3">Cab</th>
            <th className="px-6 py-3">Price Rule</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created At</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.cabPriceId}
              className={`border-t ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <td className="px-6 py-4 font-medium">{index + 1}</td>
              <td className="px-6 py-4">{item.firmName}</td>
              <td className="px-6 py-4">{item.cabType}</td>
              <td className="px-6 py-4">{item.pricingRuleId}</td>
              <td className="px-6 py-4 font-medium">₹{item.price}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
