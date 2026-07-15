import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Eye, Pencil, QrCode, Download, Ban, Trash2, SlidersHorizontal, UserPlus } from "lucide-react";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { students, HOSTEL_LIST, YEAR_LIST } from "../data/mockData";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";

const PAGE_SIZE = 10;

export default function Students() {
  const { role } = useApp();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [hostelFilter, setHostelFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const matchQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(query.toLowerCase()) ||
        s.regNumber.toLowerCase().includes(query.toLowerCase());
      const matchHostel = hostelFilter === "All" || s.hostel === hostelFilter;
      const matchYear = yearFilter === "All" || s.year === yearFilter;
      return matchQuery && matchHostel && matchYear;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "roll") return a.rollNumber.localeCompare(b.rollNumber);
      if (sortBy === "attendance") return b.attendancePercent - a.attendancePercent;
      return 0;
    });
    return list;
  }, [query, hostelFilter, yearFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const simulate = (msg) => toast.success(msg);
  const basePath = role === "super-admin" ? "/super-admin" : "/admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-dark">Student Management</h1>
          <p className="text-slate-400 text-sm mt-1">{students.length} students registered across {HOSTEL_LIST.length} hostels</p>
        </div>
        <button onClick={() => simulate("Student added successfully")} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl2 shadow-floating">
          <UserPlus size={15} /> Add Student
        </button>
      </div>

      <div className="card-surface rounded-xl3 p-4 shadow-soft flex flex-wrap gap-3 items-center">
        <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name, roll or reg. number" />
        <select value={hostelFilter} onChange={(e) => { setHostelFilter(e.target.value); setPage(1); }} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none">
          <option value="All">All Hostels</option>
          {HOSTEL_LIST.map((h) => <option key={h}>{h}</option>)}
        </select>
        <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none">
          <option value="All">All Years</option>
          {YEAR_LIST.map((y) => <option key={y}>{y}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-50 rounded-xl2 px-3 py-2.5 text-sm outline-none flex items-center gap-2">
          <option value="name">Sort: Name</option>
          <option value="roll">Sort: Roll No.</option>
          <option value="attendance">Sort: Attendance</option>
        </select>
      </div>

      <div className="card-surface rounded-xl3 p-4 shadow-soft">
        {pageItems.length === 0 ? (
          <EmptyState icon={SlidersHorizontal} title="No students found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <Table columns={["Photo", "Name", "Roll No.", "Reg. No.", "Hostel", "Room", "Course", "Year", "Status", "QR", "Actions"]}>
              {pageItems.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3"><img src={s.photo} alt="" className="w-9 h-9 rounded-full" /></td>
                  <td className="px-4 py-3">
                    <Link to={`${basePath}/students/${s.id}`} className="font-medium text-dark hover:text-primary">{s.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{s.rollNumber}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{s.regNumber}</td>
                  <td className="px-4 py-3 text-slate-500">{s.hostel}</td>
                  <td className="px-4 py-3 text-slate-500">{s.room}</td>
                  <td className="px-4 py-3 text-slate-500">{s.course}</td>
                  <td className="px-4 py-3 text-slate-500">{s.year}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={s.qrIssued ? "Issued" : "Disabled"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(s)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Eye size={15} /></button>
                      <button onClick={() => simulate("Student updated")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Pencil size={15} /></button>
                      <Link to={`/students/${s.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><QrCode size={15} /></Link>
                      <button onClick={() => simulate("QR download started")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Download size={15} /></button>
                      <button onClick={() => simulate("Student disabled")} className="p-1.5 rounded-lg hover:bg-red-50 text-danger"><Ban size={15} /></button>
                      <button onClick={() => simulate("Student deleted")} className="p-1.5 rounded-lg hover:bg-red-50 text-danger"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
          </>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Student Preview" width="max-w-sm">
        {selected && (
          <div className="flex flex-col items-center text-center gap-2">
            <img src={selected.photo} className="w-20 h-20 rounded-full" alt="" />
            <p className="font-semibold text-dark">{selected.name}</p>
            <p className="text-xs text-slate-400">{selected.rollNumber} · {selected.regNumber}</p>
            <div className="grid grid-cols-2 gap-2 w-full mt-3 text-left text-sm">
              <div className="bg-slate-50 rounded-xl2 p-3"><p className="text-xs text-slate-400">Hostel</p><p className="font-medium">{selected.hostel}</p></div>
              <div className="bg-slate-50 rounded-xl2 p-3"><p className="text-xs text-slate-400">Room</p><p className="font-medium">{selected.room}</p></div>
              <div className="bg-slate-50 rounded-xl2 p-3"><p className="text-xs text-slate-400">Course</p><p className="font-medium">{selected.course}</p></div>
              <div className="bg-slate-50 rounded-xl2 p-3"><p className="text-xs text-slate-400">Attendance</p><p className="font-medium">{selected.attendancePercent}%</p></div>
            </div>
            <Link to={`/students/${selected.id}`} className="mt-3 w-full bg-primary text-white rounded-xl2 py-2.5 text-sm font-semibold">
              View Full Profile
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
