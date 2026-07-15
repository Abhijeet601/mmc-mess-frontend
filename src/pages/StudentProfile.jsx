import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Phone, Mail, MapPin, CreditCard, IndianRupee, ReceiptText } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getStudentById, getStudentPaymentRecords, getStudentPaymentSummary, monthlyAttendance } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import ChartCard from "../components/ChartCard";
import EmptyState from "../components/EmptyState";

export default function StudentProfile() {
  const { id } = useParams();
  const student = getStudentById(id);

  if (!student) return <EmptyState title="Student not found" description="This student may have been removed." />;

  const radialData = [{ name: "attendance", value: student.attendancePercent, fill: "#2563EB" }];
  const paymentSummary = getStudentPaymentSummary(student.id);
  const paymentHistory = getStudentPaymentRecords(student.id).slice(0, 5);

  const calendarDays = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, present: Math.random() > 0.15 }));

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-dark">
        <ArrowLeft size={15} /> Back to Students
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-surface rounded-xl3 p-6 shadow-soft flex flex-col items-center text-center">
          <img src={student.photo} alt={student.name} className="w-24 h-24 rounded-full ring-4 ring-primary-50" />
          <h2 className="font-display font-semibold text-lg text-dark mt-4">{student.name}</h2>
          <p className="text-sm text-slate-400">{student.rollNumber} · {student.regNumber}</p>
          <div className="mt-2"><StatusBadge status={student.status} /></div>

          <div className="w-full mt-5 space-y-2 text-left text-sm">
            <div className="flex items-center gap-2 text-slate-500"><Phone size={14} /> {student.mobile}</div>
            <div className="flex items-center gap-2 text-slate-500"><Mail size={14} /> {student.email}</div>
            <div className="flex items-center gap-2 text-slate-500"><MapPin size={14} /> {student.hostel}, Room {student.room}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full mt-5 text-left text-sm">
            <div className="bg-slate-50 rounded-xl2 p-3"><p className="text-xs text-slate-400">Course</p><p className="font-medium">{student.course}</p></div>
            <div className="bg-slate-50 rounded-xl2 p-3"><p className="text-xs text-slate-400">Year</p><p className="font-medium">{student.year}</p></div>
          </div>
        </motion.div>

        <ChartCard title="Attendance Percentage" subtitle="Overall for current semester">
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={12} fill="#2563EB" />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-center font-display text-3xl font-semibold text-dark -mt-32">{student.attendancePercent}%</p>
          <div className="mt-24 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-amber-50 rounded-xl2 p-2"><p className="font-semibold text-warning">86%</p><p className="text-slate-400">Breakfast</p></div>
            <div className="bg-primary-50 rounded-xl2 p-2"><p className="font-semibold text-primary">92%</p><p className="text-slate-400">Lunch</p></div>
            <div className="bg-slate-100 rounded-xl2 p-2"><p className="font-semibold text-dark">88%</p><p className="text-slate-400">Dinner</p></div>
          </div>
        </ChartCard>

        <div className="card-surface rounded-xl3 p-6 shadow-soft flex flex-col items-center justify-center text-center">
          <ShieldCheck size={36} className="text-primary" />
          <h3 className="font-display font-semibold text-dark mt-4">Dynamic QR protected</h3>
          <p className="text-sm text-slate-500 mt-2">Reusable QR viewing, printing, and export are disabled for administrators. Live codes are available only in the student’s authenticated session.</p>
        </div>
      </div>

      <ChartCard title="Monthly Attendance Trend">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyAttendance}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
            <Line type="monotone" dataKey="percent" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: "#2563EB" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Payment Summary" subtitle="Mess fee status, dues, and latest receipts">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            ["Total Paid", paymentSummary.totalPaid, CreditCard, "bg-green-50 text-success"],
            ["Pending Amount", paymentSummary.pendingAmount, IndianRupee, "bg-amber-50 text-warning"],
            ["Outstanding", paymentSummary.totalOutstanding, IndianRupee, "bg-red-50 text-danger"],
            ["Last Payment", paymentSummary.lastPayment?.total || 0, ReceiptText, "bg-blue-50 text-primary"],
          ].map(([label, value, Icon, tone]) => (
            <div key={label} className="rounded-xl2 bg-slate-50 p-4">
              <div className={`w-9 h-9 rounded-xl2 flex items-center justify-center ${tone}`}>
                <Icon size={16} />
              </div>
              <p className="text-xs text-slate-400 mt-3">{label}</p>
              <p className="font-display text-xl font-semibold text-dark">₹{Number(value).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl2 border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {["Month", "Amount", "Fine", "Date", "Mode", "Receipt", "Status"].map((column) => (
                  <th key={column} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3">{payment.month}</td>
                  <td className="px-4 py-3">₹{payment.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">₹{payment.fine.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{payment.paymentDate || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{payment.paymentMode}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{payment.receiptNo}</td>
                  <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">Next due date: {new Date(paymentSummary.nextDueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
      </ChartCard>

      <ChartCard title="Attendance Calendar" subtitle="Last 30 days">
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-15 gap-1.5">
          {calendarDays.map((d) => (
            <div
              key={d.day}
              title={`Day ${d.day}: ${d.present ? "Present" : "Absent"}`}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium ${
                d.present ? "bg-primary-100 text-primary" : "bg-red-50 text-danger"
              }`}
            >
              {d.day}
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
