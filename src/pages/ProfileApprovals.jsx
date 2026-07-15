import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function ProfileApprovals() {
  const [requests, setRequests] = useState([]);
  const load = () => apiRequest("/admin/profile-change-requests").then((r) => setRequests(r.requests)).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, []);
  const decide = async (id, decision) => { try { await apiRequest(`/admin/profile-change-requests/${id}/decision`, { method: "POST", body: JSON.stringify({ decision }) }); toast.success(`Request ${decision.toLowerCase()}`); load(); } catch (e) { toast.error(e.message); } };
  return <div className="space-y-6"><div><h1 className="font-display text-2xl font-semibold text-dark">Profile Change Requests</h1><p className="text-sm text-slate-400">Review the current value beside each requested update.</p></div>
    <div className="space-y-4">{requests.map((r) => <div key={r.id} className="rounded-xl3 border border-slate-100 bg-white p-5 shadow-soft"><div className="flex flex-wrap justify-between gap-2"><div><h2 className="font-semibold text-dark">{r.name}</h2><p className="text-xs text-slate-400">{r.registration_number}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{r.status}</span></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-400"><th className="py-2">Field</th><th>Old value</th><th>Requested value</th></tr></thead><tbody>{Object.entries(r.changes).map(([field,value]) => <tr key={field} className="border-t border-slate-50"><td className="py-2 font-medium">{field.replaceAll("_", " ")}</td><td>{r[field] || "—"}</td><td className="text-primary">{value || "—"}</td></tr>)}</tbody></table></div>
      {r.status === "Pending Approval" && <div className="mt-4 flex gap-2"><button onClick={() => decide(r.id,"Approved")} className="flex items-center gap-1 rounded-xl2 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700"><Check size={15}/>Approve</button><button onClick={() => decide(r.id,"Rejected")} className="flex items-center gap-1 rounded-xl2 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"><X size={15}/>Reject</button></div>}</div>)}{!requests.length && <div className="rounded-xl3 bg-white p-8 text-center text-sm text-slate-400">No profile change requests.</div>}</div></div>;
}
