"use client";

import { useState } from "react";

export default function InvoicePrintPage() {
  const [invoice] = useState({
    company: {
      name: "SHRAVANI TOURS AND TRAVELS",
      address:
        "Sr. No. 2040, Siddhivinayak Colony, Road No.4, Papde Wasti, Fursungi - 412308",
      contact: "07384739777",
      gstin: "27AJPR6872R1ZZ",
    },
    to: {
      name: "Kansai Nerolac Paints Limited",
      address:
        "28th Floor, A-Wing, Marathon Futurex, NM Joshi Marg, Lower Parel, Mumbai - 400013",
      gstin: "27AAACK1376N1ZC",
    },
    billTo: {
      name: "Kansai Nerolac Paints Ltd",
      address:
        "Sr. No.34, Pirangut Road, Near Manas Lake, Ghotawade Phata",
    },
    info: {
      date: "25/11/2025",
      invoiceNo: "3261",
      itinerary: "460",
      dutySlip: "460",
      bookedBy: "Mr. Devkar Sir",
    },
    user: {
      name: "Mr. Arshad Ali Sir",
      mobile: "9871219879",
    },
    cab: {
      type: "Dzire",
      number: "MH12XM7187",
      driver: "Ashok",
      place: "Mahabaleshwar",
    },
    trip: {
      startKm: 41558,
      closeKm: 41918,
      totalKm: 360,
      startDate: "23/11/2025",
      endDate: "23/11/2025",
      startTime: "7.00am",
      endTime: "9.30pm",
      days: 1,
      hours: 14,
    },
    items: [
      { name: "FIRST 80KM / 8 HOURS", qty: 1, rate: 3900 },
      { name: "Extra Km", qty: 60, rate: 13 },
      { name: "Extra Hrs", qty: 2, rate: 85 },
      { name: "Toll and Parking", qty: 1, rate: 405 },
    ],
  });

  const total = invoice.items.reduce(
    (sum, i) => sum + i.qty * i.rate,
    0
  );

  return (
    <div className="page">
      {/* PRINT BUTTON (SCREEN ONLY) */}
      <div className="toolbar">
        <button onClick={() => window.print()}>🖨 Print Invoice</button>
      </div>

      <div className="sheet">
        {/* HEADER */}
        <div className="header-box">
          <div className="logo">ST</div>
          <div className="company">
            <b>{invoice.company.name}</b>
            <div>{invoice.company.address}</div>
            <div>Contact No: {invoice.company.contact}</div>
            <div>GSTIN : {invoice.company.gstin}</div>
          </div>
          <div className="invoice-word">Invoice</div>
        </div>

        {/* TO + INFO */}
        <table className="table">
          <tbody>
            <tr>
              <td className="left">
                <b>To</b><br />
                {invoice.to.name}<br />
                {invoice.to.address}<br />
                GST No : {invoice.to.gstin}
              </td>
              <td className="left">
                Date : {invoice.info.date}<br />
                Invoice No : {invoice.info.invoiceNo}<br />
                Itinerary Code : {invoice.info.itinerary}<br />
                Duty Slip No : {invoice.info.dutySlip}<br />
                Booked By : {invoice.info.bookedBy}
              </td>
            </tr>
          </tbody>
        </table>

        {/* BILL TO / USER / CAB — TABLE FORMAT (LIKE PHOTO) */}
        <table className="table">
          <thead>
            <tr>
              <th>Bill To</th>
              <th>User Details</th>
              <th>Cab Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="left">
                <b>{invoice.billTo.name}</b><br />
                {invoice.billTo.address}
              </td>
              <td className="left">
                Name : {invoice.user.name}<br />
                Mob No : {invoice.user.mobile}
              </td>
              <td className="left">
                Cab Type : {invoice.cab.type}<br />
                Cab No : {invoice.cab.number}<br />
                Driver Name : {invoice.cab.driver}<br />
                {invoice.cab.place}
              </td>
            </tr>
          </tbody>
        </table>

        {/* TRIP DETAILS */}
        <table className="table">
          <tbody>
            <tr>
              <td>Start Kms</td><td>{invoice.trip.startKm}</td>
              <td>Start Date</td><td>{invoice.trip.startDate}</td>
              <td>Start Time</td><td>{invoice.trip.startTime}</td>
            </tr>
            <tr>
              <td>Close Kms</td><td>{invoice.trip.closeKm}</td>
              <td>End Date</td><td>{invoice.trip.endDate}</td>
              <td>End Time</td><td>{invoice.trip.endTime}</td>
            </tr>
            <tr>
              <td>Total</td><td>{invoice.trip.totalKm}</td>
              <td>Days</td><td>{invoice.trip.days}</td>
              <td>Hours</td><td>{invoice.trip.hours}</td>
            </tr>
          </tbody>
        </table>

        {/* PARTICULARS */}
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
            {invoice.items.map((i, idx) => (
              <tr key={idx}>
                <td>{i.name}</td>
                <td>{i.qty}</td>
                <td>{i.rate}</td>
                <td>{i.qty * i.rate}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3}><b>Total Amount</b></td>
              <td><b>{total}</b></td>
            </tr>
          </tbody>
        </table>

        <div className="words">
          <b>Rupees In Word :</b> Five Thousand Two Hundred Fifty Five Rupees Only.
        </div>

        <div className="terms">
          <div>Kms & Hrs will be calculated from office to office.</div>
          <div>Insurance of passenger is not included.</div>
          <div>Cancellation Charges Rs.1000 compulsory.</div>
          <div>Toll and parking paid by party.</div>
        </div>

        <div className="sign">
          <div>Customer Sign</div>
          <div>For Shravani Tours and Travels</div>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        @page { size: A4; margin: 10mm; }

        .toolbar {
          text-align: right;
          margin-bottom: 6px;
        }

        .sheet {
          border: 1px solid #000;
          padding: 8mm;
          font-size: 11px;
          font-family: Arial;
        }

        .header-box {
          border: 1px solid #000;
          display: grid;
          grid-template-columns: 50px 1fr 80px;
          padding: 6px;
          align-items: center;
        }

        .logo {
          border: 1px solid #000;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .company { text-align: center; }
        .invoice-word { text-align: right; font-weight: bold; }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }

        .table th,
        .table td {
          border: 1px solid #000;
          padding: 4px;
          text-align: center;
        }

        .left {
          text-align: left;
          vertical-align: top;
          line-height: 1.4;
        }

        .words {
          margin-top: 6px;
          font-weight: bold;
        }

        .terms {
          border-top: 1px solid #000;
          margin-top: 6px;
          padding-top: 4px;
          font-size: 10px;
        }

        .sign {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
        }
@media print {
  /* Hide App Layout Header (CABLIFE) */
  :global(header),
  :global(nav),
  :global(aside),
  :global(.app-header) {
    display: none !important;
  }

  /* Hide print button */
  .toolbar {
    display: none !important;
  }

  /* Ensure invoice prints properly */
  body {
    margin: 0;
  }

  .page {
    position: static;
    width: 100%;
  }
}



      `}</style>
    </div>
  );
}
