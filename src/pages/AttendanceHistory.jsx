import { useEffect, useState } from "react";
import { FileSpreadsheet, FileText, Printer, Download } from "lucide-react";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { HOSTEL_LIST, MEAL_LIST } from "../data/mockData";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 12;

export default function AttendanceHistory() {
  const { role } = useApp();
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState("All");
  const [hostel, setHostel] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
    if (query.trim() && role !== "student") params.set("search", query.trim());
    if (meal !== "All") params.set("meal", meal);
    if (hostel !== "All" && role !== "student") params.set("hostel", hostel);
    if (dateFilter) params.set("date", dateFilter);
    setLoading(true);
    apiRequest(`/attendance?${params.toString()}`)
      .then((data) => {
        if (!active) return;
        setRecords((data.records || []).map((item) => ({
          ...item,
          date: item.scanned_at,
          rollNumber: item.registration_number,
          photo: item.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name)}`,
          status: "Present",
        })));
        setTotal(Number(data.total || 0));
      })
      .catch((error) => {
        if (!active) return;
        setRecords([]);
        setTotal(0);
        toast.error(error.message);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, meal, hostel, dateFilter, page, role]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = records;

  const exportAs = (type) => toast.success(`Exporting attendance as ${type}...`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-dark">{role === "student" ? "My Attendance" : "Attendance History"}</h1>
          <p className="text-slate-400 text-sm mt-1">{total.toLocaleString("en-IN")} records found</p>
        </div>
        {role !== "student" ? <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportAs("Excel")} className="flex items-center gap-1.5 bg-green-50 text-success text-xs font-semibold px-3 py-2 rounded-xl2"><FileSpreadsheet size={14} /> Excel</button>
          <button onClick={() => exportAs("CSV")} className="flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-2 rounded-xl2"><Download size={14} /> CSV</button>
          <button onClick={() => exportAs("PDF")} className="flex items-center gap-1.5 bg-red-50 text-danger text-xs font-semibold px-3 py-2 rounded-xl2"><FileText size={14} /> PDF</button>
          <button onClick={() => toast.success("Sending to printer...")} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl2"><Printer size={14} /> Print</button>
        </div> : null}
      </div>

      <div className="card-surface rounded-xl3 p-4 shadow-soft flex flex-wrap gap-3">
        {role !== "student" ? <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name or roll number" /> : null}
        <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none" />
        <select value={meal} onChange={(e) => { setMeal(e.target.value); setPage(1); }} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none">
          <option value="All">All Meals</option>
          {MEAL_LIST.map((m) => <option key={m}>{m}</option>)}
        </select>
        {role !== "student" ? <select value={hostel} onChange={(e) => { setHostel(e.target.value); setPage(1); }} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none">
          <option value="All">All Hostels</option>
          {HOSTEL_LIST.map((h) => <option key={h}>{h}</option>)}
        </select> : null}
      </div>

      <div className="card-surface rounded-xl3 p-4 shadow-soft">
        {pageItems.length === 0 ? (
          <EmptyState title={loading ? "Loading attendance" : "No attendance records"} description={loading ? "Fetching live attendance data..." : "Adjust your filters to see results."} />
        ) : (
          <>
            <Table columns={["Photo", "Name", "Roll No.", "Hostel", "Meal", "Date", "Time", "Status"]}>
              {pageItems.map((a) => {
                const d = new Date(a.date);
                return (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3"><img src={a.photo} alt="" className="w-8 h-8 rounded-full" /></td>
                    <td className="px-4 py-3 font-medium text-dark">{a.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{a.rollNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{a.hostel}</td>
                    <td className="px-4 py-3 text-slate-500">{a.meal}</td>
                    <td className="px-4 py-3 text-slate-500">{d.toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3 text-slate-500">{d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                );
              })}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} total={total} pageSize={PAGE_SIZE} />
          </>
        )}
      </div>
    </div>
  );
}
