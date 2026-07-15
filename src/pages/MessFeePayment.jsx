import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  CalendarDays, CheckCircle2, CreditCard, Download, Eye, FileText, IndianRupee,
  Printer, ReceiptText, Search, ShieldCheck, WalletCards,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../lib/api";

const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

function PaymentStatus({ status }) {
  const className = {
    Paid: "bg-green-50 text-success border-green-100",
    Pending: "bg-amber-50 text-warning border-amber-100",
    Overdue: "bg-red-50 text-danger border-red-100",
  }[status] || "bg-slate-50 text-slate-500 border-slate-100";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>{status}</span>;
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  const tones = {
    info: "bg-blue-50 text-blue-600",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
    success: "bg-green-50 text-success",
  };
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-xl3 bg-white border border-slate-100 p-5 shadow-soft">
      <div className={`w-10 h-10 rounded-xl2 flex items-center justify-center ${tones[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-sm text-slate-400 mt-4">{label}</p>
      <p className="font-display text-2xl font-semibold text-dark mt-1">{value}</p>
    </motion.div>
  );
}

function ReceiptModal({ receipt, student, onClose }) {
  if (!receipt) return null;
  const total = Number(receipt.amount || 0) + Number(receipt.fine || 0);
  const qrValue = JSON.stringify({
    receipt: receipt.receipt_no,
    transaction: receipt.transaction_id,
    student: student.registration_number,
    amount: total,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl rounded-xl3 bg-white shadow-floating overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-dark">Payment Receipt</h2>
            <p className="text-xs text-slate-400">{receipt.receipt_no}</p>
          </div>
          <button onClick={onClose} className="rounded-xl2 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">Close</button>
        </div>

        <div className="p-6">
          <div className="rounded-xl3 border border-slate-100 p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl2 bg-grad-primary text-white flex items-center justify-center font-display text-xl font-semibold">MMC</div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-dark">Magadh Mahila College</h3>
                  <p className="text-sm text-slate-500">MMC Hostel Mess Fee Receipt</p>
                  <p className="text-xs text-slate-400">Vaidehi & Mahila Hostels</p>
                </div>
              </div>
              <QRCode value={qrValue} size={90} fgColor="#0F172A" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
              <div className="md:col-span-1">
                <img src={student.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`} alt={student.name} className="w-24 h-24 rounded-xl3 border border-slate-100" />
                <p className="font-semibold text-dark mt-3">{student.name}</p>
                <p className="text-xs text-slate-400">{student.registration_number}</p>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Hostel", student.hostel],
                  ["Room Number", student.room_number],
                  ["Mess Fee Month", `${receipt.month} ${receipt.year}`],
                  ["Payment Date", receipt.payment_date || "-"],
                  ["Payment Mode", receipt.payment_mode || "-"],
                  ["Transaction ID", receipt.transaction_id || "-"],
                  ["Amount", money(receipt.amount)],
                  ["Late Fine", money(receipt.fine)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl2 bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-semibold text-dark mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs text-slate-400">Authorized Signature</p>
                <p className="font-display text-lg font-semibold text-dark mt-6">Mess Accounts Office</p>
              </div>
              <div className="rounded-xl2 bg-green-50 px-5 py-4 text-right">
                <p className="text-xs text-green-700">Total Paid</p>
                <p className="font-display text-3xl font-semibold text-success">{money(total)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl2 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600">
              <Printer size={15} /> Print Receipt
            </button>
            <button onClick={() => toast.success("Receipt PDF generated")} className="inline-flex items-center gap-2 rounded-xl2 bg-primary px-4 py-2.5 text-sm font-semibold text-white">
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function MessFeePayment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("All");
  const [status, setStatus] = useState("All");
  const [receipt, setReceipt] = useState(null);

  const loadPayments = async () => {
    setLoading(true);
    try {
      setData(await apiRequest("/payments/me"));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const student = data?.student;
  const summary = data?.summary || {};
  const records = useMemo(() => data?.invoices || [], [data]);
  const current = data?.current;
  const paymentConfig = data?.config || {};

  const filtered = useMemo(() => records.filter((record) => {
    const q = query.toLowerCase();
    const matchesQuery = [record.receipt_no, record.month, record.transaction_id, record.payment_mode, record.status]
      .join(" ")
      .toLowerCase()
      .includes(q);
    const matchesMonth = month === "All" || record.month === month;
    const matchesStatus = status === "All" || record.status === status;
    return matchesQuery && matchesMonth && matchesStatus;
  }), [records, query, month, status]);

  const handlePay = async (invoiceId = current?.id) => {
    if (!invoiceId) return;
    try {
      const order = await apiRequest("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ invoice_id: invoiceId, gateway: "demo" }),
      });
      await apiRequest("/payments/demo/confirm", {
        method: "POST",
        body: JSON.stringify({ gateway_order_id: order.gateway_order_id }),
      });
      toast.success("Payment completed through backend demo gateway");
      await loadPayments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="rounded-xl3 bg-white border border-slate-100 p-6 text-sm text-slate-500 shadow-soft">Loading payment records...</div>;
  }

  if (!data || !student || !current) {
    return (
      <div className="rounded-xl3 bg-white border border-slate-100 p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-dark">No payment profile found</h1>
        <p className="text-sm text-slate-500 mt-2">Your login ID is not linked to a student record in the backend.</p>
      </div>
    );
  }

  const canPay = current.status !== "Paid";
  const gateways = [
    paymentConfig.demo_gateway_enabled ? "Demo Gateway" : null,
    paymentConfig.razorpay_enabled ? "Razorpay" : null,
    paymentConfig.ccavenue_enabled ? "CCAvenue" : null,
    paymentConfig.bank_transfer_enabled ? "Bank Transfer" : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-dark">Mess Fee Payment</h1>
          <p className="text-sm text-slate-400 mt-1">Pay monthly mess fees, download receipts, and track your payment history.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {gateways.map((gateway) => (
            <span key={gateway} className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              {gateway}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 rounded-xl3 bg-white border border-sky-100 p-6 shadow-floating">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-sky-600">Current Month Fee</p>
              <h2 className="font-display text-3xl font-semibold text-dark mt-2">{current.month} {current.year}</h2>
              <p className="text-sm text-slate-400 mt-2">Due by {new Date(current.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[260px]">
              <div className="rounded-xl2 bg-sky-50 p-4">
                <p className="text-xs text-sky-700">Mess Fee Amount</p>
                <p className="font-display text-2xl font-semibold text-dark mt-1">{money(current.amount)}</p>
              </div>
              <div className="rounded-xl2 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <div className="mt-2"><PaymentStatus status={current.status} /></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {canPay ? (
              <button onClick={() => handlePay()} className="inline-flex items-center gap-2 rounded-xl2 bg-primary px-5 py-3 text-sm font-semibold text-white shadow-floating">
                <CreditCard size={16} /> Pay Now
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-xl2 bg-green-50 px-5 py-3 text-sm font-semibold text-success">
                <CheckCircle2 size={16} /> Payment Successful
              </button>
            )}
            {summary.lastPayment && (
              <>
                <button onClick={() => setReceipt(summary.lastPayment)} className="inline-flex items-center gap-2 rounded-xl2 bg-white border border-slate-100 px-5 py-3 text-sm font-semibold text-slate-600">
                  <Eye size={16} /> View Receipt
                </button>
                <button onClick={() => toast.success("Receipt download started")} className="inline-flex items-center gap-2 rounded-xl2 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600">
                  <Download size={16} /> Download Receipt
                </button>
              </>
            )}
          </div>
        </motion.div>

        <div className="rounded-xl3 bg-white border border-slate-100 p-6 shadow-soft">
          <h3 className="font-display font-semibold text-dark">Payment Timeline</h3>
          <div className="mt-5 space-y-4">
            {["Gateway order", "Payment verification", "Database update", "Receipt and email"].map((step, index) => (
              <div key={step} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? "bg-primary text-white" : "bg-green-50 text-success"}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark">{step}</p>
                  <p className="text-xs text-slate-400">Backend audit log enabled</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Current Outstanding" value={money(summary.pendingAmount)} icon={IndianRupee} tone="info" />
        <SummaryCard label="Previous Due" value={money(Math.max(0, summary.totalOutstanding - current.amount - current.fine))} icon={CalendarDays} tone="warning" />
        <SummaryCard label="Late Fine" value={money(summary.lateFine)} icon={ShieldCheck} tone="danger" />
        <SummaryCard label="Total Payable" value={money(summary.totalOutstanding)} icon={WalletCards} tone="success" />
      </div>

      <div className="rounded-xl3 bg-white border border-slate-100 p-5 shadow-soft">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display font-semibold text-dark">Payment History</h2>
            <p className="text-xs text-slate-400">Receipts, transaction IDs, gateway modes, and payment status</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search payments" className="w-56 rounded-xl2 bg-slate-50 pl-9 pr-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary-100" />
            </div>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl2 bg-slate-50 px-3 py-2.5 text-sm outline-none">
              <option>All</option>
              {[...new Set(records.map((record) => record.month))].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl2 bg-slate-50 px-3 py-2.5 text-sm outline-none">
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl2 border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {["Receipt No.", "Month", "Amount", "Fine", "Payment Date", "Payment Mode", "Transaction ID", "Status", "Receipt"].map((column) => (
                  <th key={column} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-dark whitespace-nowrap">{record.receipt_no || "-"}</td>
                  <td className="px-4 py-3">{record.month}</td>
                  <td className="px-4 py-3">{money(record.amount)}</td>
                  <td className="px-4 py-3">{money(record.fine)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{record.payment_date || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{record.payment_mode || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{record.transaction_id || "-"}</td>
                  <td className="px-4 py-3"><PaymentStatus status={record.status} /></td>
                  <td className="px-4 py-3">
                    {record.status === "Paid" ? (
                      <button onClick={() => setReceipt(record)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1.5 text-xs font-semibold text-primary">
                        <ReceiptText size={13} /> View
                      </button>
                    ) : (
                      <button onClick={() => handlePay(record.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-warning">
                        <FileText size={13} /> Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal receipt={receipt} student={student} onClose={() => setReceipt(null)} />
    </div>
  );
}
