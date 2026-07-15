import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Laptop } from "lucide-react";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { auditLogs } from "../data/mockData";

export default function AuditLogs() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return auditLogs.filter((l) => {
      const q = !query || l.action.toLowerCase().includes(query.toLowerCase()) || l.admin.toLowerCase().includes(query.toLowerCase());
      const s = status === "All" || l.status === status;
      return q && s;
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-dark">Audit Logs</h1>
        <p className="text-slate-400 text-sm mt-1">Track every administrative action across the system</p>
      </div>

      <div className="card-surface rounded-xl3 p-4 shadow-soft flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search action or admin..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none">
          <option value="All">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="card-surface rounded-xl3 p-6 shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="No matching logs" />
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-100" />
            <div className="space-y-5">
              {filtered.slice(0, 30).map((log, i) => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-50" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-50 rounded-xl2 p-4">
                    <div>
                      <p className="text-sm font-medium text-dark">{log.action}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{log.admin}</span>
                        <span className="flex items-center gap-1"><Laptop size={11} /> {log.device}</span>
                        <span>{new Date(log.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                    </div>
                    <StatusBadge status={log.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
