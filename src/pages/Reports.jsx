import { Download, TrendingUp, Building2, TrendingDown, UtensilsCrossed } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import {
  weeklyAttendanceTrend, mealDistribution, hostelDistribution, courseDistribution,
  monthlyAttendance, dashboardStats,
} from "../data/mockData";
import toast from "react-hot-toast";

const YEAR_WISE = [
  { year: "1st Year", percent: 89 }, { year: "2nd Year", percent: 92 },
  { year: "3rd Year", percent: 87 }, { year: "4th Year", percent: 84 },
];

const COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#7C3AED", "#0EA5E9", "#EC4899", "#14B8A6", "#F97316", "#84CC16"];

export default function Reports() {
  const mostActive = hostelDistribution.reduce((a, b) => (b.students > a.students ? b : a));
  const leastActive = hostelDistribution.reduce((a, b) => (b.students < a.students ? b : a));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-dark">Reports & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Comprehensive mess performance overview</p>
        </div>
        <button onClick={() => toast.success("Generating full report...")} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl2 shadow-floating">
          <Download size={15} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Meals Served" value={mealDistribution.reduce((a, b) => a + b.value, 0)} icon={UtensilsCrossed} color="primary" />
        <StatCard label="Attendance %" value={Math.round((dashboardStats.todayAttendance / dashboardStats.totalStudents) * 100)} suffix="%" icon={TrendingUp} color="success" />
        <StatCard label="Most Active Hostel" value={mostActive.students} icon={Building2} color="warning" />
        <StatCard label="Least Active Hostel" value={leastActive.students} icon={TrendingDown} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Attendance Trend" subtitle="Present vs absent across the week">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyAttendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="present" stroke="#2563EB" strokeWidth={2.5} name="Present" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2.5} name="Absent" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Meal Comparison" subtitle="Today's scans by meal type">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mealDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {mealDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hostel Comparison" subtitle="Registered students per hostel">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hostelDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} angle={-15} textAnchor="end" height={60} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
              <Bar dataKey="students" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Attendance" subtitle="Percentage trend across months">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyAttendance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
              <Line type="monotone" dataKey="percent" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Course-wise Distribution" subtitle="Students per course">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={courseDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {courseDistribution.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Year-wise Attendance" subtitle="Average attendance by academic year">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={YEAR_WISE} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis type="category" dataKey="year" tickLine={false} axisLine={false} width={80} tick={{ fontSize: 12, fill: "#334155" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF2F7", fontSize: 13 }} />
              <Bar dataKey="percent" fill="#7C3AED" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
