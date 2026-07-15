import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { Printer, Download, RefreshCw, Ban, Share2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import toast from "react-hot-toast";

export default function QRCard({ student, readOnly = false }) {
  const status = student.status === "Suspended" ? "Suspended" : student.qrIssued ? "Issued" : "Disabled";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-surface rounded-xl3 p-4 shadow-soft flex flex-col items-center text-center gap-3"
    >
      <div className="flex items-center gap-2 self-start">
        <img src={student.photo} alt={student.name} className="w-8 h-8 rounded-full" />
        <div className="text-left overflow-hidden">
          <p className="text-sm font-semibold text-dark truncate max-w-[140px]">{student.name}</p>
          <p className="text-xs text-slate-400">{student.rollNumber}</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl2 border border-slate-100">
        <QRCode value={student.qrCode} size={104} fgColor="#0F172A" />
      </div>

      <StatusBadge status={status} />
      <div className="text-xs text-slate-400 -mt-1">
        Issued {student.qrIssuedDate} · Expires {student.qrExpiry}
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-full">
        <button onClick={() => toast.success("Sent to printer")} className="p-2 rounded-xl2 bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center">
          <Printer size={14} />
        </button>
        <button onClick={() => toast.success("QR download started")} className="p-2 rounded-xl2 bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center">
          <Download size={14} />
        </button>
        {readOnly ? (
          <>
            <button onClick={() => toast.success("QR copied for sharing")} className="p-2 rounded-xl2 bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center">
              <Share2 size={14} />
            </button>
            <button onClick={() => toast("Contact hostel office for QR replacement")} className="p-2 rounded-xl2 bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center">
              <QrIcon />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => toast.success("QR regenerated")} className="p-2 rounded-xl2 bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center">
              <RefreshCw size={14} />
            </button>
            <button onClick={() => toast.error("QR disabled")} className="p-2 rounded-xl2 bg-red-50 hover:bg-red-100 text-danger flex items-center justify-center">
              <Ban size={14} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function QrIcon() {
  return <span className="text-[11px] font-bold">QR</span>;
}
