"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useGetMyFirmQuery } from "@/features/firm/firmApi";
import { useGetFirmTermsQuery } from "@/features/firmTerm/firmTermApi";
import { useGetDutySlipInvoiceQuery } from "@/features/dutyslip/dutyslipApi";

/* ================= HELPERS ================= */
const formatDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("en-GB") : "";

const formatTime = (v?: string | null) =>
  v
    ? new Date(v).toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const invoiceNo = (createdAt?: string, id?: number) => {
  if (!createdAt || !id) return "";
  const d = new Date(createdAt);
  return `INV-${d.getFullYear()}-${String(id).padStart(4, "0")}`;
};

const dutySlipNo = (id?: number) =>
  id ? String(id).padStart(4, "0") : "";

/* ================= PAGE ================= */
export default function InvoicePrintPage() {
  const { id } = useParams();
  const dutySlipId = Number(id);

  const { data: firm } = useGetMyFirmQuery();
  const { data: terms = [] } = useGetFirmTermsQuery();
  const { data } = useGetDutySlipInvoiceQuery(dutySlipId);

  const duty = data?.dutySlip;
  const users = data?.customerUsers ?? [];

  const totalMinutes = duty?.totalTimeInMin ?? 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.ceil(totalHours / 24);

  const totalAmount = useMemo(() => 5255, []);

  if (!duty) return <div>Loading invoice…</div>;

  return (
    <div className="page">
      <div className="toolbar">
        <button onClick={() => window.print()}>🖨 Print Invoice</button>
      </div>

      <div className="sheet">
       {/* ================= HEADER ================= */}
<div className="header">
  {/* Logo */}
  <div className="logo">
    {firm?.firmDetails?.logoImagePath ? (
      <img src={firm.firmDetails.logoImagePath} />
    ) : (
      <b>{firm?.firmCode}</b>
    )}
  </div>

  {/* Company Details */}
  <div className="company">
    <div className="title">{firm?.firmName}</div>
    <div>{firm?.firmDetails?.address}</div>
    <div>Contact No : {firm?.firmDetails?.contactNumber}</div>
  </div>

  {/* Invoice + GST */}
  <div className="rightBox">
    <div className="invoiceText">Invoice</div>
    <div className="gstText">
      GSTIN : {firm?.firmDetails?.gstNumber}
    </div>
  </div>
</div>


        {/* ================= TO / INFO ================= */}
        <table className="tbl">
          <tbody>
            <tr>
              <td>
                <b>To</b><br />
                {duty.customerName}<br />
                {duty.customerAddress}<br />
                GST No : {duty.customerGstNumber}
              </td>
              <td>
                Date : {formatDate(duty.bookedDate)}<br />
                Invoice No : {invoiceNo(duty.createdAt, duty.dutySlipId)}<br />
                Duty Slip No : {dutySlipNo(duty.dutySlipId)}<br />
                Booked By : {duty.driverName}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= BILL / USER / CAB ================= */}
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "33%" }}>Bill To</th>
              <th style={{ width: "34%" }}>User Details</th>
              <th style={{ width: "33%" }}>Cab Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>{duty.customerName}</b><br />
                {duty.customerAddress}
              </td>

              <td>
                {users.map((u: any) => (
                  <div key={u.customerUserId}>
                    Name : {u.userName}<br />
                    Mob. No : {u.mobileNumber}
                  </div>
                ))}
              </td>

              <td>
                Cab Type : {duty.sentCabType}<br />
                Cab No : {duty.cabNumber}<br />
                Driver Name : {duty.driverName}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="tbl">
  <tbody>
    <tr>
      <td
        colSpan={2}
        style={{
          borderTop: "1px solid #000",
          borderBottom: "1px solid #000",
          borderLeft: "1px solid #000",
          borderRight: "none",
        }}
      ></td>

      <td
        style={{
          borderTop: "1px solid #000",
          borderBottom: "1px solid #000",
          borderLeft: "none",
          borderRight: "1px solid #000",
          textAlign: "right",
          fontWeight: "bold",
          paddingRight: "8px",
        }}
      >
        {duty.destination}
      </td>
    </tr>
  </tbody>
</table>


        {/* ================= TRIP DETAILS ================= */}
        <table className="tbl">
          <tbody>
            <tr>
              <td>Start Kms</td><td>{duty.startKms}</td>
              <td>Start Date</td><td>{formatDate(duty.startDateTime)}</td>
              <td>Start Time</td><td>{formatTime(duty.startDateTime)}</td>
            </tr>
            <tr>
              <td>Close Kms</td><td>{duty.closeKms}</td>
              <td>End Date</td><td>{formatDate(duty.closeDateTime)}</td>
              <td>End Time</td><td>{formatTime(duty.closeDateTime)}</td>
            </tr>
            <tr>
              <td>Total</td><td>{duty.totalKms}</td>
              <td>Days</td><td>{totalDays}</td>
              <td>Hours</td><td>{totalHours}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= PARTICULARS ================= */}
        <table className="tbl">
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
              <td><b>{totalAmount}</b></td>
            </tr>
          </tbody>
        </table>

        {/* ================= RUPEES IN WORD ================= */}
        <div className="words">
          <b>RUPEES IN WORD :</b> Five Thousand Two Hundred Fifty Five Rupees Only.
        </div>

        {/* ================= TERMS + SIGN (TOP ALIGNED) ================= */}
        <table className="tbl">
          <tbody>
            <tr style={{ height: 120 }}>
              <td style={{ width: "50%", fontSize: 10, verticalAlign: "top" }}>
                {terms.filter(t => t.isActive).map(t => (
                  <div key={t.firmTermId}>{t.description}</div>
                ))}
              </td>
              <td style={{ width: "25%", textAlign: "center", verticalAlign: "top" }}>
                Customer Sign
              </td>
              <td style={{ width: "25%", textAlign: "center", verticalAlign: "top" }}>
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
        .header { border: 1px solid #000; display: grid; grid-template-columns: 70px 1fr 80px; padding: 6px; }
        .header {
  border: 1px solid #000;
  display: grid;
  grid-template-columns: 70px 1fr 180px;
  padding: 6px;
  align-items: start;
}

.logo {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.company {
  text-align: center;
  line-height: 1.3;
}

.title {
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
}

.rightBox {
  text-align: right;
  line-height: 1.4;
}

.invoiceText {
  font-weight: bold;
}

.gstText {
  font-size: 11px;
}

        .tbl { width: 100%; border-collapse: collapse; margin-top: 6px; }
        .tbl th, .tbl td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
        .destination { border: none; text-align: right; font-weight: bold; padding-right: 8px; }
        .words { margin-top: 6px; font-size: 11px; }
        @media print { .toolbar { display: none; } }
      `}</style>
    </div>
  );
}
