"use client";

// src/app/(admin)/order/payment/[buyerPurchaseId]/slip/[paymentId]/page.tsx

import { useParams } from "next/navigation";
import { useGetPaymentDetailsQuery } from "@/features/order/orderApi";
import Button from "@/components/atoms/Button";
import numberToWords from "@/lib/numberToWords";

export default function PaymentSlipPage() {
  const params = useParams();
  const buyerPurchaseId = Number(params?.buyerPurchaseId);
  const paymentId = Number(params?.paymentId);

  // Fetch payment details using both buyerPurchaseId and paymentId
  const { data, isLoading, isError } = useGetPaymentDetailsQuery(buyerPurchaseId);

  if (isLoading) return <p className="p-6">Loading payment slip...</p>;
  if (isError || !data?.data) return <p className="p-6">Failed to load payment slip</p>;

  const slip = data.data;

  const handlePrint = () => window.print();

  return (
    <>
      {/* BUTTONS (HIDDEN IN PRINT) */}
      <div className="no-print flex gap-4 p-4">
        <Button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Print Slip
        </Button>
      </div>

      {/* PRINT WRAPPER */}
      <div className="print-wrapper">
        <div id="payment-slip" className="invoice-page">

          {/* HEADER */}
          <div className="po-title">PAYMENT SLIP</div>

          <div className="company-name">{slip.productName}</div>

          <div className="company-address">
            Order ID: {slip.buyerPurchaseId} | Payment ID: {slip.paymentId}
          </div>

          {/* ORDER INFO */}
          <table className="info-table">
            <tbody>
              <tr>
                <td>
                  <b>Order Details</b><br />
                  Product: {slip.productName}<br />
                  Quantity: {slip.quantity}<br />
                  Amount: ₹{slip.totalAmount}<br />
                  Status: {slip.orderStatus}<br />
                  Date: {slip.orderDate
                    ? new Date(slip.orderDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </td>

                <td>
                  <b>Delivery Details</b><br />
                  Driver: {slip.driverName || "N/A"}<br />
                  Mobile: {slip.mobileNumber || "N/A"}<br />
                  Vehicle: {slip.vehicleNumber || "N/A"}<br />
                  Type: {slip.vehicleType || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* PAYMENT DETAILS */}
          <table className="main-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Status</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Transaction</th>
                <th>Paid On</th>
                <th>Amount Paid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{slip.paymentId || "-"}</td>
                <td>{slip.paymentStatus || "Pending"}</td>
                <td>{slip.paymentMethod || "-"}</td>
                <td>{slip.paymentReference || "-"}</td>
                <td>{slip.gatewayTransactionId || "-"}</td>
                <td>
                  {slip.paymentDate
                    ? new Date(slip.paymentDate).toLocaleString("en-GB")
                    : "-"}
                </td>
                <td>₹{slip.amountPaid || 0}</td>
              </tr>

              <tr>
                <td colSpan={6}><b>VERIFICATION STATUS</b></td>
                <td>
                  <b>{slip.isVerified ? "Verified" : "Pending"}</b>
                </td>
              </tr>
            </tbody>
          </table>

          {/* AMOUNT IN WORDS */}
          <div className="words">
            AMOUNT PAID (IN WORDS):
            <b> {numberToWords(Number(slip.amountPaid || 0))}</b>
          </div>

          {/* SIGN AREA */}
          <div className="footer">
            <div>
              Order ID: {slip.buyerPurchaseId}<br />
              Product: {slip.productName}
            </div>

            <div className="signature">
              Authorized Signatory<br />
              <b>{slip.productName}</b>
            </div>
          </div>
        </div>
      </div>

      <PaymentSlipStyles />
    </>
  );
}

function PaymentSlipStyles() {
  return (
    <style jsx global>{`
@media print {
  header, nav, .no-print {
    display: none !important;
  }

  .print-wrapper {
    width: 210mm;
    margin: 0 auto;
  }

  .invoice-page {
    width: 210mm;
    min-height: 297mm;
    padding: 12mm;
    box-sizing: border-box;
    page-break-inside: avoid;
  }
}

.print-wrapper {
  display: flex;
  justify-content: center;
}

.invoice-page {
  width: 210mm;
  min-height: 297mm;
  padding: 12mm;
  background: #fff;
  border: 1px solid #000;
  font-family: Arial;
}

.po-title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #000;
  margin-bottom: 6px;
}

.company-name {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.company-address {
  text-align: center;
  font-size: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-top: 8px;
}

th, td {
  border: 1px solid black;
  padding: 4px;
}

.words {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 6px;
  margin-top: 6px;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.signature {
  text-align: right;
}
        `}</style>
  );
}
