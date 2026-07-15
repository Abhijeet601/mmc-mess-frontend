import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, GraduationCap, Lock, Mail, QrCode, ShieldCheck, Sparkles,
  ScanLine, University, Users, UtensilsCrossed,
} from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { apiRequest, saveSession } from "../lib/api";

const PORTALS = {
  "super-admin": {
    role: "super-admin",
    path: "/super-admin",
    title: "Super Admin Login",
    eyebrow: "Magadh Mahila College Executive Portal",
    description: "Full mess governance for Vaidehi Hostel and Mahila Hostel, QR security, analytics, and audit controls.",
    email: "",
    name: "Super Admin",
    theme: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-dark",
    panel: "bg-white/85 backdrop-blur-xl border-blue-100",
    accent: "from-blue-500 via-cyan-400 to-blue-700",
    icon: ShieldCheck,
    bullets: ["System Health", "Audit Logs", "College Settings"],
  },
  admin: {
    role: "admin",
    path: "/admin",
    title: "Admin Login",
    eyebrow: "Hostel Mess Operations",
    description: "Fast operational access for student records, live scanner, QR cards, meals, and reports.",
    email: "",
    name: "Hostel Admin",
    theme: "min-h-screen bg-surface text-dark",
    panel: "glass border-white/60",
    accent: "from-blue-600 to-cyan-500",
    icon: Users,
    bullets: ["Live Scanner", "Student Search", "Meal Schedule"],
  },
  student: {
    role: "student",
    path: "/student",
    title: "Student Login",
    eyebrow: "Student Mess Portal",
    description: "View your QR card, meal attendance, notifications, and personal mess profile.",
    email: "",
    name: "Student",
    theme: "min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-dark",
    panel: "bg-white/80 backdrop-blur-xl border-sky-100",
    accent: "from-sky-500 to-blue-500",
    icon: GraduationCap,
    bullets: ["Live Mess QR", "Weekly Meal Menu", "Profile Requests"],
  },
};

export default function Login({ portal }) {
  const navigate = useNavigate();
  const { setIsAuthenticated, setRole, setCurrentStudentId, setCurrentUser } = useApp();
  const config = PORTALS[portal];
  const [loginId, setLoginId] = useState(config?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!config) {
    return (
      <div className="min-h-screen bg-surface bg-grad-mesh p-6 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-xl3 bg-grad-primary text-white flex items-center justify-center shadow-floating">
              <UtensilsCrossed size={26} />
            </div>
            <h1 className="font-display text-3xl font-semibold mt-5">Magadh Mahila College Mess Portal</h1>
            <p className="text-slate-500 mt-2">Separate portals for college administration, mess staff, and hostel students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.values(PORTALS).map(({ role, path, title, eyebrow, description, icon: Icon, accent }) => (
              <Link key={role} to={`${path}/login`} className="card-surface rounded-xl3 p-6 shadow-soft hover:shadow-floating transition-all group">
                <div className={`w-12 h-12 rounded-xl2 bg-gradient-to-br ${accent} text-white flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-semibold text-primary mt-5">{eyebrow}</p>
                <h2 className="font-display text-xl font-semibold mt-1">{title}</h2>
                <p className="text-sm text-slate-500 mt-2 min-h-[60px]">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Open portal <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const session = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          portal: config.role,
          login_id: loginId.trim(),
          password,
        }),
      });
      saveSession(session);
      setRole(session.role);
      setCurrentUser(session.user);
      setCurrentStudentId(session.user.student_id || null);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${session.user.name}!`);
      navigate(`${config.path}/dashboard`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${config.theme} relative overflow-hidden flex items-center justify-center p-6`}>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "34px 34px",
      }} />
      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className={`w-16 h-16 rounded-xl3 bg-gradient-to-br ${config.accent} text-white flex items-center justify-center shadow-floating`}>
            <Icon size={30} />
          </div>
          <p className="mt-8 text-sm font-semibold text-primary-200">{config.eyebrow}</p>
          <h1 className="font-display text-5xl font-semibold mt-3 leading-tight">{config.title}</h1>
          <p className="mt-4 max-w-xl text-slate-500">{config.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
            {config.bullets.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                className="rounded-xl3 p-4 bg-white shadow-soft border border-slate-100"
              >
                <Sparkles size={17} className={portal === "student" ? "text-sky-500" : "text-primary"} />
                <p className="text-sm font-semibold mt-3">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            {[QrCode, ScanLine, University].map((ItemIcon, index) => (
              <motion.div
                key={index}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 + index, ease: "easeInOut" }}
                className="w-14 h-14 rounded-xl3 flex items-center justify-center bg-white shadow-soft"
              >
                <ItemIcon size={22} className="text-primary" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl3 border p-7 md:p-8 shadow-glass ${config.panel}`}
        >
          <div className={`w-12 h-12 rounded-xl2 bg-gradient-to-br ${config.accent} text-white flex items-center justify-center mb-5`}>
            <Icon size={22} />
          </div>
          <p className="text-xs font-semibold text-primary">{config.eyebrow}</p>
          <h2 className="font-display text-2xl font-semibold mt-1">{config.title}</h2>
          <p className="text-sm mt-2 mb-6 text-slate-500">
            Use the real login ID issued by the hostel ERP administrator.
          </p>

          <label className="text-xs font-semibold mb-1.5 block">Login ID</label>
          <div className="relative mb-4">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="username" autoComplete="username" value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="Enter your real ID" className="w-full bg-white text-dark border border-slate-200 focus:border-primary rounded-xl2 pl-10 pr-4 py-3 text-sm outline-none" />
          </div>

          <label className="text-xs font-semibold mb-1.5 block">Password</label>
          <div className="relative mb-5">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" name="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-white text-dark border border-slate-200 focus:border-primary rounded-xl2 pl-10 pr-4 py-3 text-sm outline-none" />
          </div>

          <button disabled={loading} className={`w-full bg-gradient-to-r ${config.accent} text-white font-semibold rounded-xl2 py-3 text-sm shadow-floating flex items-center justify-center gap-2 disabled:opacity-70`}>
            {loading ? "Verifying..." : "Login"}
            {!loading && <ArrowRight size={16} />}
          </button>

          <Link to="/login" className="block text-center text-xs mt-5 text-slate-500">
            Switch portal
          </Link>
        </motion.form>
      </div>
    </div>
  );
}
