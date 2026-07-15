import { motion } from "framer-motion";
import { Search, Bell, UtensilsCrossed, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { clock, currentMeal, unreadCount, setMobileSidebarOpen, setSidebarCollapsed, role, currentUser } = useApp();
  const navigate = useNavigate();

  const dateStr = clock.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const timeStr = clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const persona = {
    "super-admin": { name: currentUser?.name || "Super Admin", label: "Super Administrator", seed: currentUser?.login_id || "super-admin" },
    admin: { name: currentUser?.name || "Hostel Admin", label: "Mess Administrator", seed: currentUser?.login_id || "admin" },
    student: { name: currentUser?.name || "Student", label: "Hostel Student", seed: currentUser?.login_id || "student" },
  }[role] || { name: currentUser?.name || "User", label: "ERP User", seed: currentUser?.login_id || "user" };
  const basePath = role === "super-admin" ? "/super-admin" : role === "student" ? "/student" : "/admin";
  const isExecutive = role === "super-admin";
  const isStudent = role === "student";

  return (
    <header className={`sticky top-0 z-20 h-20 flex items-center px-4 md:px-8 gap-4 ${
      isExecutive ? "bg-white/80 backdrop-blur-xl border-b border-blue-100" : isStudent ? "bg-white/75 backdrop-blur-xl border-b border-sky-100" : "glass border-b border-slate-100"
    }`}>
      <button
        onClick={() => {
          setSidebarCollapsed(false);
          setMobileSidebarOpen(true);
        }}
        className="md:hidden w-10 h-10 rounded-xl2 bg-slate-50 flex items-center justify-center text-slate-500"
      >
        <Menu size={18} />
      </button>

      <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
        <span className="font-medium text-dark">{dateStr}</span>
        <span className="text-slate-300">•</span>
        <span className="font-mono tabular-nums text-primary">{timeStr}</span>
      </div>

      <motion.div
        key={currentMeal}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex items-center gap-1.5 bg-primary-50 text-primary px-3 py-1.5 rounded-full text-xs font-semibold"
      >
        <UtensilsCrossed size={13} />
        {currentMeal}
      </motion.div>

      <div className="flex-1 max-w-md ml-2">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={isStudent ? "Search your meals, QR, notices..." : "Search students, rolls, hostels..."}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                navigate(`${basePath}/${isStudent ? "attendance" : "students"}?q=${encodeURIComponent(e.currentTarget.value)}`);
              }
            }}
            className="w-full bg-slate-50 border border-transparent focus:border-primary-100 focus:bg-white rounded-xl2 pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`${basePath}/notifications`)}
        className="relative w-10 h-10 rounded-xl2 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
      >
        <motion.div animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}>
          <Bell size={18} />
        </motion.div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold min-w-[18px] min-h-[18px] px-1 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <button onClick={() => navigate(`${basePath}/profile`)} className={`flex items-center gap-2.5 pl-2 border-l ${isExecutive ? "border-blue-100" : "border-slate-100"}`}>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${persona.seed}`}
          alt={persona.name}
          className="w-9 h-9 rounded-full ring-2 ring-primary-100"
        />
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-dark leading-tight">{persona.name}</p>
          <p className="text-xs text-slate-400">{persona.label}</p>
        </div>
      </button>
    </header>
  );
}
