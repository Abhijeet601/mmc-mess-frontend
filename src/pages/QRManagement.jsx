import { Clock3, QrCode, ShieldCheck, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import DynamicStudentQR from "../components/DynamicStudentQR";
import { students } from "../data/mockData";

export default function QRManagement() {
  const { role, currentStudentId } = useApp();
  if (role === "student") {
    const student = students.find((item) => item.id === currentStudentId);
    if (!student) return <div className="rounded-xl3 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">No student record is linked to this account.</div>;
    return <div className="space-y-6"><DynamicStudentQR student={student} /><div className="rounded-xl3 bg-white p-6 shadow-soft"><h2 className="font-display font-semibold text-dark">Safe QR usage</h2><p className="mt-2 text-sm text-slate-500">Keep this page open and present the current live code. There is no downloadable or permanent student QR.</p></div></div>;
  }
  const cards=[[ShieldCheck,"One-time validation","Every accepted code is consumed atomically and cannot be replayed."],[Clock3,"30-second expiry","Old captures and recordings quickly become invalid."],[QrCode,"No embedded student ID","The code contains only a random opaque token."],[Smartphone,"Student-session bound","Only an authenticated linked student can request a live code."]];
  return <div className="space-y-6"><div><h1 className="font-display text-2xl font-semibold text-dark">QR Security</h1><p className="text-sm text-slate-400">Dynamic mess-access policy and scanner safeguards.</p></div><div className="rounded-xl3 border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-soft"><h2 className="font-display text-xl font-semibold text-dark">Static QR export is disabled</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">Administrators cannot view, print, download, generate, or export reusable student QR codes. Live tokens are issued only inside the authenticated student session.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{cards.map(([Icon,title,text])=><div key={title} className="rounded-xl3 border border-slate-100 bg-white p-5 shadow-soft"><Icon className="text-primary" size={21}/><h3 className="mt-3 font-semibold text-dark">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></div>)}</div></div>;
}
