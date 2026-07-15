import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Ban, Building2, CheckCircle2, Clock, GraduationCap,
  Hash, Home, Phone, QrCode, XCircle,
} from "lucide-react";

const CONFIG = {
  success: { icon: CheckCircle2, bg: "bg-green-50", text: "text-success", label: "Scan Successful" },
  duplicate: { icon: AlertTriangle, bg: "bg-amber-50", text: "text-warning", label: "Duplicate Scan Detected" },
  invalid: { icon: XCircle, bg: "bg-red-50", text: "text-danger", label: "Invalid QR Code" },
  disabled: { icon: Ban, bg: "bg-red-50", text: "text-danger", label: "Student Account Disabled" },
  closed: { icon: Clock, bg: "bg-slate-100", text: "text-slate-500", label: "Meal Window Closed" },
};

export default function ScanResultPopup({ result, onClose }) {
  if (!result) return null;
  const cfg = CONFIG[result.type];
  const Icon = cfg.icon;
  const scanTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -10 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="card-surface rounded-xl3 p-5 shadow-glass w-full max-w-lg mx-auto"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.08 }}
            className={`w-14 h-14 rounded-full ${cfg.bg} flex items-center justify-center relative`}
          >
            {result.type === "success" && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-success"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <Icon size={28} className={cfg.text} />
          </motion.div>
          <p className={`font-display font-semibold text-lg ${cfg.text}`}>{cfg.label}</p>

          {result.student && (
            <div className="w-full mt-1 overflow-hidden rounded-xl3 border border-slate-100 bg-white text-left">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Mess Attendance ID Card</p>
                <p className="font-display text-lg font-semibold">Magadh Mahila College</p>
              </div>

              <div className="grid grid-cols-[92px_1fr] gap-4 p-4">
                <img src={result.student.photo} alt={result.student.name} className="w-20 h-20 rounded-xl2 object-cover ring-4 ring-blue-50" />
                <div className="min-w-0">
                  <p className="font-display text-xl font-semibold text-dark truncate">{result.student.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{result.student.rollNumber}</p>
                  <p className="text-xs text-slate-500">{result.student.regNumber}</p>
                  <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                    <Icon size={12} /> {cfg.label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 px-4 pb-4 text-xs">
                {[
                  [GraduationCap, "Course", result.student.course],
                  [Building2, "Hostel", result.student.hostel],
                  [Home, "Room", result.student.room],
                  [Hash, "Meal", result.meal],
                  [Clock, "Scan Time", scanTime],
                  [Phone, "Mobile", result.student.mobile || "Not added"],
                ].map(([InfoIcon, label, value]) => (
                  <div key={label} className="rounded-xl2 bg-slate-50 p-2.5">
                    <p className="flex items-center gap-1.5 text-slate-400"><InfoIcon size={12} /> {label}</p>
                    <p className="mt-1 font-semibold text-dark truncate">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">QR Verification</p>
                  <p className="text-xs font-semibold text-dark truncate">One-time token consumed</p>
                </div>
                <QrCode size={24} className="text-primary shrink-0 ml-3" />
              </div>
            </div>
          )}

          {result.message && <p className="text-sm text-slate-500">{result.message}</p>}

          <button onClick={onClose} className="mt-2 text-sm font-medium text-slate-400 hover:text-dark">
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
