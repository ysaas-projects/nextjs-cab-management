"use client";

import { useParams } from "next/navigation";
import { useGetInvoiceQuery } from "@/features/order/orderApi";
import Button from "@/components/atoms/Button";
import numberToWords from "@/lib/numberToWords";

export default function InvoiceBillPage() {
    const params = useParams();
    const orderId = Number(params?.id);

    const { data, isLoading, isError } = useGetInvoiceQuery(orderId);

    if (isLoading) return <p className="p-6">Loading invoice...</p>;
    if (isError || !data?.data) return <p className="p-6">Failed to load invoice</p>;

    const invoice = data.data;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;

        const element = document.getElementById("invoice-print");
        if (!element) return;

        const options: any = {
            margin: 0,
            filename: `Invoice_${invoice.buyerPurchaseId}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 1,
                useCORS: true,
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait",
            },
            pagebreak: { mode: ["avoid-all", "css"] },
        };

        html2pdf().set(options).from(element).save();
    };


    return (
        <>
            {/* ACTION BUTTONS (HIDDEN IN PRINT) */}
            <div className="no-print flex gap-4 p-4">
                <Button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded"                
                >Print</Button>

                {/* <Button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Download PDF
                </Button> */}
            </div>

            {/* PRINT WRAPPER */}
            <div className="print-wrapper">
                <div id="invoice-print" className="invoice-page">

                    {/* HEADER */}
                    <div className="po-title">PURCHASE ORDER</div>

                    <div className="company-name">{invoice.millName}</div>
                    <div className="company-address">{invoice.millFullAddress}</div>
                    <div className="company-address">
                        GSTIN: {invoice.millGSTNumber || "N/A"} | PAN: {invoice.millPANNumber || "N/A"}
                    </div>

                    {/* BUYER INFO */}
                    <table className="info-table">
                        <tbody>
                            <tr>
                                <td>
                                    <b>Purchase From:</b><br />
                                    {invoice.buyerName}<br />
                                    {invoice.buyerFullAddress}<br />
                                    GSTIN: {invoice.buyerGSTNumber}<br />
                                    PAN: {invoice.buyerPANNumber}
                                </td>

                                <td>
                                    <b>Invoice Details</b><br />
                                    PO No: {invoice.buyerPurchaseId}<br />
                                    Date: {invoice.purchaseOrderDate
                                        ? new Date(invoice.purchaseOrderDate).toLocaleDateString("en-GB")
                                        : "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* ITEMS */}
                    <table className="main-table">
                        <thead>
                            <tr>
                                <th>SR</th>
                                <th>Item</th>
                                <th>Grade</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>{invoice.productName}</td>
                                <td>{invoice.productGrade}</td>
                                <td>{invoice.quantity}</td>
                                <td>{invoice.totalAmount / invoice.quantity}</td>
                                <td>{invoice.totalAmount}</td>
                            </tr>

                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {/* <td colSpan={6}>&nbsp;</td> */}
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>

                                </tr>
                            ))}

                            <tr>
                                <td colSpan={5}><b>TOTAL</b></td>
                                <td><b>{invoice.totalAmount}</b></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* TOTAL WORDS */}
                    <div className="words">
                        TOTAL (IN WORDS): <b>{numberToWords(invoice.totalAmount)}</b>
                    </div>

                    {/* FOOTER */}
                    <div className="footer">
                        <div>
                            Driver: {invoice.driverName || "N/A"} <br />
                            Vehicle No: {invoice.vehicleNumber || "N/A"}
                        </div>

                        <div className="signature">
                            Authorized Signatory<br />
                            <b>{invoice.millName}</b>
                        </div>
                    </div>
                </div>
            </div>

            {/* STYLES */}
            <style jsx global>{`
@media print {
  header,
  nav,
  .no-print {
    display: none !important;
  }

  body {
    margin: 0;
    padding: 0;
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
    overflow: hidden;
  }

  table, tr, td, th {
    page-break-inside: avoid !important;
  }
}

/* NORMAL VIEW */
.print-wrapper {
  display: flex;
  justify-content: center;
}

.invoice-page {
  width: 210mm;
  min-height: 297mm;
  padding: 12mm;
  background: white;
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
  font-size: 22px;
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

.info-table td {
  vertical-align: top;
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
        </>
    );
}
