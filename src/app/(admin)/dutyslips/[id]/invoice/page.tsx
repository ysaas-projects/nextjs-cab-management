"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useGetMyFirmQuery } from "@/features/firm/firmApi";
import { useGetFirmTermsQuery } from "@/features/firmTerm/firmTermApi";
import { useGetDutySlipInvoiceQuery } from "@/features/dutyslip/dutyslipApi";

/* =======================
   HELPERS
======================= */
const formatDate = (date?: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB");
};

const formatTime = (date?: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const generateInvoiceNo = (createdAt?: string, id?: number) => {
  if (!createdAt || !id) return "";
  const d = new Date(createdAt);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `INV-${year}${month}-${id}`;
};

const formatDutySlipNo = (id?: number) => {
  if (!id) return "";
  return String(id).padStart(4, "0");
};

export default function InvoicePrintPage() {
  /* =======================
     PARAM
  ======================= */
  const { id } = useParams();
  const dutySlipId = Number(id);

  /* =======================
     LOGIN FIRM
  ======================= */
  const { data: firm } = useGetMyFirmQuery();

  /* =======================
     FIRM TERMS
  ======================= */
  const { data: terms = [] } = useGetFirmTermsQuery();

  /* =======================
     INVOICE API (IMPORTANT)
  ======================= */
  const { data } = useGetDutySlipInvoiceQuery(dutySlipId);

  const duty = data?.dutySlip;
  const customerUsers = data?.customerUsers ?? [];

  /* =======================
     TOTAL (STATIC FOR NOW)
  ======================= */
  const total = useMemo(() => 5255, []);

  if (!duty) return <div>Loading invoice...</div>;

  return (
    <div className="page">
      <div className="toolbar">
        <button onClick={() => window.print()}>🖨 Print Invoice</button>
      </div>

      <div className="sheet">
        {/* ================= HEADER ================= */}
        <div className="header-box">
          <div className="logo">
            {firm?.firmDetails?.logoImagePath ? (
              <img
                src={firm.firmDetails.logoImagePath}
                className="logo-img"
                alt="logo"
              />
            ) : (
              firm?.firmCode ?? "ST"
            )}
          </div>

          <div className="company">
            <div className="title">{firm?.firmName}</div>
            <div>{firm?.firmDetails?.address ?? ""}</div>
            <div>Contact No : {firm?.firmDetails?.contactNumber ?? ""}</div>
            <div>GSTIN : {firm?.firmDetails?.gstNumber ?? ""}</div>
          </div>

          <div className="invoice-word">Invoice</div>
        </div>

        {/* ================= TO + INFO ================= */}
        <table className="table">
          <tbody>
            <tr>
              <td>
                <b>To</b><br />
                {duty.customerName}<br />
                {duty.customerAddress ?? ""}<br />
                GST No : {duty.customerGstNumber ?? ""}
              </td>
              <td>
                Date : {formatDate(duty.bookedDate)} <br />
                Iternary Code:<br/>
                Invoice No : {generateInvoiceNo(duty.createdAt, duty.dutySlipId)} <br />
                Duty Slip No : {formatDutySlipNo(duty.dutySlipId)} <br />
                Booked By : {duty.driverName ?? ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= BILL / USER / CAB ================= */}
        <table className="table bill-user-cab">
          <thead>
            <tr>
              <th>Bill To</th>
              <th>User Details</th>
              <th>Cab Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>{duty.customerName}</b><br />
                {duty.customerAddress ?? ""}<br />
              </td>

              {/* ✅ CUSTOMER USERS */}
              <td>
  {customerUsers.length === 0 ? (
    "-"
  ) : (
    customerUsers.map((u: any) => (
      <div key={u.customerUserId} style={{ marginBottom: "6px" }}>
        <div>
          <b>Name :</b> {u.userName}
        </div>
        <div>
          <b>Mob. No :</b> {u.mobileNumber}
        </div>
      </div>
    ))
  )}
</td>

              <td>
                Cab Type : {duty.sentCabType ?? duty.requestedCabType ?? ""}<br />
                Cab No : {duty.cabNumber ?? ""}<br />
                Driver Name : {duty.driverName ?? ""}<br />
                {duty.destination ?? ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= TRIP DETAILS ================= */}
        <table className="table">
          <tbody>
            <tr>
              <td>Start Kms</td><td>{duty.startKms ?? ""}</td>
              <td>Start Date</td><td>{formatDate(duty.startDateTime)}</td>
              <td>Start Time</td><td>{formatTime(duty.startDateTime)}</td>
            </tr>
            <tr>
              <td>Close Kms</td><td>{duty.closeKms ?? ""}</td>
              <td>End Date</td><td>{formatDate(duty.closeDateTime)}</td>
              <td>End Time</td><td>{formatTime(duty.closeDateTime)}</td>
            </tr>
            <tr>
              <td>Total</td><td>{duty.totalKms ?? ""}</td>
              <td>Days</td><td></td>
              <td>Hours</td><td></td>
            </tr>
          </tbody>
        </table>

        {/* ================= PARTICULARS (UNCHANGED) ================= */}
        <table className="table">
          <thead>
            <tr>
              <th>Particulars</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>FIRST 80KM / 8 HOURS</td><td>1</td><td>3900</td><td>3900</td></tr>
            <tr><td>Extra Km</td><td>60</td><td>13</td><td>780</td></tr>
            <tr><td>Extra Hrs</td><td>2</td><td>85</td><td>170</td></tr>
            <tr><td>Toll and Parking</td><td>1</td><td>405</td><td>405</td></tr>
            <tr>
              <td colSpan={3}><b>Total Amount</b></td>
              <td><b>{total}</b></td>
            </tr>
          </tbody>
        </table>

        {/* ================= TERMS + SIGN ================= */}
        <table className="table">
          <tbody>
            <tr style={{ height: "120px" }}>
              <td style={{ width: "50%", fontSize: "10px" }}>
                {terms
                  .filter(t => t.isActive)
                  .map(t => (
                    <div key={t.firmTermId}>{t.description}</div>
                  ))}
              </td>
              <td style={{ width: "25%", textAlign: "center" }}>
                Customer Sign
              </td>
              <td style={{ width: "25%", textAlign: "center" }}>
                For {firm?.firmName}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        @page { size: A4; margin: 10mm; }
        .toolbar { text-align: right; margin-bottom: 6px; }
        .sheet { border: 1px solid #000; padding: 8mm; font-family: Arial; font-size: 11px; }
        .header-box { border: 1px solid #000; display: grid; grid-template-columns: 60px 1fr 80px; padding: 6px; }
        .logo { border: 1px solid #000; border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; }
        .logo-img { width: 100%; height: 100%; object-fit: contain; }
        .company { text-align: center; line-height: 1.3; }
        .title { font-size: 14px; font-weight: bold; text-transform: uppercase; }
        .invoice-word { text-align: right; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        .table th, .table td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
        @media print { .toolbar { display: none; } }
      `}</style>
    </div>
  );
}
