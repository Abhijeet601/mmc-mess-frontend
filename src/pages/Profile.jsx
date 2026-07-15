import { useEffect, useState } from "react";
import { Camera, Mail, Phone, ShieldCheck, Activity, LogIn, QrCode, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { apiRequest } from "../lib/api";

const ACTIVITY = [
  { icon: LogIn, label: "Logged in from Chrome / Windows", time: "Today, 9:12 AM" },
  { icon: QrCode, label: "Regenerated QR batch for Vaidehi Hostel", time: "Yesterday, 4:45 PM" },
  { icon: FileDown, label: "Exported monthly attendance report", time: "2 days ago" },
];

export default function Profile() {
  const { role } = useApp();
  if (role === "student") return <StudentProfileEditor />;
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-dark">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your administrator account</p>
      </div>

      <div className="card-surface rounded-xl3 p-6 shadow-soft flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin-priya" alt="Admin" className="w-24 h-24 rounded-full ring-4 ring-primary-50" />
          <button onClick={() => toast.success("Profile photo updated")} className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-floating">
            <Camera size={14} />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display font-semibold text-xl text-dark">Admin Priya</h2>
          <p className="text-sm text-slate-400">Mess Administrator | Magadh Mahila College</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Mail size={14} /> mess.admin@magadhmahilacollege.org</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> +91 612 222 5555</span>
            <span className="flex items-center gap-1.5 text-success"><ShieldCheck size={14} /> Verified Admin</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Scans Approved", value: "4,281" },
          { label: "QR Regenerated", value: "312" },
          { label: "Reports Exported", value: "58" },
          { label: "Active Since", value: "Jan 2024" },
        ].map((s) => (
          <div key={s.label} className="card-surface rounded-xl3 p-4 shadow-soft text-center">
            <p className="font-display font-semibold text-lg text-dark">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-surface rounded-xl3 p-6 shadow-soft">
        <h3 className="font-display font-semibold text-dark mb-4 flex items-center gap-2"><Activity size={16} /> Recent Activity</h3>
        <div className="space-y-3">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl2 bg-slate-50">
              <div className="w-9 h-9 rounded-xl2 bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <a.icon size={16} />
              </div>
              <div>
                <p className="text-sm text-dark">{a.label}</p>
                <p className="text-xs text-slate-400">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); toast.success("Password updated successfully"); }} className="card-surface rounded-xl3 p-6 shadow-soft">
        <h3 className="font-display font-semibold text-dark mb-4">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <input type="password" name="current-password" autoComplete="current-password" placeholder="Current password" className="bg-slate-50 rounded-xl2 px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary-100" />
          <input type="password" name="new-password" autoComplete="new-password" placeholder="New password" className="bg-slate-50 rounded-xl2 px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary-100" />
        </div>
        <button type="submit" className="mt-4 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl2 shadow-floating">
          Update Password
        </button>
      </form>
    </div>
  );
}

function StudentProfileEditor() {
  const [student, setStudent] = useState(null); const [changes, setChanges] = useState({}); const [requests, setRequests] = useState([]);
  const load = () => Promise.all([apiRequest("/student/me"), apiRequest("/student/profile-change-requests")]).then(([s,r]) => { setStudent(s); setChanges({}); setRequests(r.requests); }).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, []);
  if (!student) return <div className="rounded-xl3 bg-white p-6 text-sm text-slate-400">Loading profile…</div>;
  const fields = ["name","email","mobile","hostel","room_number","course","academic_year"];
  const submit = async () => { const clean = Object.fromEntries(Object.entries(changes).filter(([,v]) => v !== "")); if (!Object.keys(clean).length) return toast.error("Change at least one field"); try { await apiRequest("/student/profile-change-requests", { method:"POST", body:JSON.stringify({changes:clean}) }); toast.success("Sent for admin approval"); load(); } catch(e) { toast.error(e.message); } };
  return <div className="max-w-3xl space-y-6"><div><h1 className="font-display text-2xl font-semibold text-dark">My Profile</h1><p className="text-sm text-slate-400">Changes are applied only after administrator approval.</p></div><div className="rounded-xl3 border border-sky-100 bg-white p-6 shadow-soft"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{fields.map((f) => <label key={f} className="text-xs font-semibold text-slate-500 capitalize">{f.replaceAll("_"," ")}<input value={changes[f] ?? student[f] ?? ""} onChange={(e) => setChanges({...changes,[f]:e.target.value})} className="mt-1.5 w-full rounded-xl2 border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-normal outline-none focus:border-sky-200" /></label>)}</div><button onClick={submit} className="mt-5 rounded-xl2 bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white">Request profile update</button></div><div className="rounded-xl3 bg-white p-5 shadow-soft"><h2 className="font-semibold text-dark">Request history</h2><div className="mt-3 space-y-2">{requests.map((r) => <div key={r.id} className="flex items-center justify-between rounded-xl2 bg-slate-50 p-3 text-sm"><span>{Object.keys(r.changes).map((x) => x.replaceAll("_"," ")).join(", ")}</span><span className="font-semibold text-slate-600">{r.status}</span></div>)}{!requests.length && <p className="text-sm text-slate-400">No requests yet.</p>}</div></div></div>;
}
