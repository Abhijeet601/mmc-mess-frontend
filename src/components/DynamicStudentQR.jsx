import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { apiRequest } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function DynamicStudentQR({ student }) {
  const { clock } = useApp();
  const [qr, setQr] = useState(null);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try { setQr(await apiRequest("/student/qr", { method: "POST" })); setError(""); }
    catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { refresh(); const timer = setInterval(refresh, 25000); return () => clearInterval(timer); }, [refresh]);
  const remaining = qr ? Math.max(0, Math.ceil((new Date(qr.expires_at).getTime() - clock.getTime()) / 1000)) : 0;

  return (
    <section className="rounded-xl3 border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-5 shadow-floating">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-sky-700"><ShieldCheck size={18} /><h2 className="font-display font-semibold">Your live Mess QR</h2></div>
          <p className="mt-2 text-sm text-slate-500">Present this code at the scanner. It rotates every 25 seconds and can only be accepted once.</p>
          <p className="mt-3 text-xs text-slate-400">Capture deterrence is enabled, but screenshots cannot be fully prevented in a web browser. Shared or captured codes expire quickly.</p>
        </div>
        <div className="relative select-none overflow-hidden rounded-xl3 border border-sky-100 bg-white p-4" onContextMenu={(e) => e.preventDefault()}>
          {qr ? <QRCode value={qr.token} size={150} fgColor="#0f172a" /> : <div className="h-[150px] w-[150px] animate-pulse rounded-xl bg-slate-100" />}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -rotate-12 bg-sky-600/10 py-1 text-center text-[10px] font-bold text-sky-900 animate-pulse">
            {student?.name} · {student?.registration_number || student?.regNumber} · {clock.toLocaleTimeString("en-IN")}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs"><span className={remaining < 8 ? "text-red-500" : "text-slate-500"}>{remaining}s remaining</span><button onClick={refresh} className="text-sky-600" aria-label="Refresh QR"><RefreshCw size={14} /></button></div>
          {error && <p className="mt-2 max-w-[150px] text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </section>
  );
}
