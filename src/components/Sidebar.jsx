import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ScanLine, Users, QrCode, ClipboardList, UtensilsCrossed,
  BarChart3, Bell, ShieldCheck, Settings, UserCircle, LogOut, ChevronsLeft, ChevronsRight,
  Building2, DatabaseBackup, LineChart, CreditCard, X, UserCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["super-admin", "admin", "student"] },
  { to: "/admins", label: "Admins", icon: ShieldCheck, roles: ["super-admin"], disabled: true },
  { to: "/hostels", label: "Hostels", icon: Building2, roles: ["super-admin"], disabled: true },
  { to: "/students", label: "Students", icon: Users, roles: ["super-admin", "admin"] },
  { to: "/qr-management", label: "QR Management", icon: QrCode, roles: ["super-admin", "admin"] },
  { to: "/scanner", label: "Scanner Management", icon: ScanLine, roles: ["super-admin"] },
  { to: "/scanner", label: "Live Scanner", icon: ScanLine, roles: ["admin"] },
  { to: "/attendance", label: "Attendance", icon: ClipboardList, roles: ["super-admin", "admin", "student"] },
  { to: "/meals", label: "Meal Menu", icon: UtensilsCrossed, roles: ["super-admin", "admin", "student"] },
  { to: "/profile-requests", label: "Profile Requests", icon: UserCheck, roles: ["super-admin", "admin"] },
  { to: "/mess-fees", label: "Mess Fee Management", icon: CreditCard, roles: ["super-admin", "admin"] },
  { to: "/reports", label: "Analytics", icon: LineChart, roles: ["super-admin"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["super-admin", "admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["super-admin", "admin", "student"] },
  { to: "/audit-logs", label: "Audit Logs", icon: DatabaseBackup, roles: ["super-admin"] },
  { to: "/settings", label: "System Settings", icon: Settings, roles: ["super-admin"] },
  { to: "/profile", label: "Profile", icon: UserCircle, roles: ["super-admin", "admin", "student"] },
];

export default function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    unreadCount,
    role,
    setIsAuthenticated,
  } = useApp();
  const navigate = useNavigate();
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const basePath = role === "super-admin" ? "/super-admin" : role === "student" ? "/student" : "/admin";
  const isExecutive = role === "super-admin";
  const isStudent = role === "student";
  const shellClass = isExecutive
    ? "fixed md:sticky inset-y-0 left-0 flex flex-col h-screen bg-white border-r border-blue-100 z-40 transition-transform duration-300"
    : isStudent
      ? "fixed md:sticky inset-y-0 left-0 flex flex-col h-screen bg-white border-r border-sky-100 z-40 transition-transform duration-300"
      : "fixed md:sticky inset-y-0 left-0 flex flex-col h-screen bg-white border-r border-slate-100 z-40 transition-transform duration-300";

  const handleLogout = () => {
    setMobileSidebarOpen(false);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    setTimeout(() => navigate(`${basePath}/login`), 600);
  };

  return (
    <>
      <button
        aria-label="Close sidebar backdrop"
        onClick={() => setMobileSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[2px] transition-opacity md:hidden ${
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <motion.aside
        animate={{ width: sidebarCollapsed ? 84 : 264 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`${shellClass} ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
      <div className={`flex items-center gap-3 px-5 h-20 border-b ${isExecutive ? "border-blue-100" : isStudent ? "border-sky-100" : "border-slate-100"}`}>
        <div className={`w-10 h-10 rounded-xl2 ${isStudent ? "bg-gradient-to-br from-sky-500 to-blue-500" : "bg-grad-primary"} flex items-center justify-center shadow-floating shrink-0`}>
          <UtensilsCrossed size={20} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-semibold text-sm leading-tight whitespace-nowrap text-dark">
              {isExecutive ? "MMC Command" : isStudent ? "MMC Student" : "MMC Mess ERP"}
            </p>
            <p className="text-xs text-slate-400 whitespace-nowrap">
              {isExecutive ? "Magadh Mahila College" : isStudent ? "My Mess Portal" : "Vaidehi & Mahila Hostels"}
            </p>
          </div>
        )}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="ml-auto md:hidden w-9 h-9 rounded-xl2 bg-slate-50 text-slate-500 flex items-center justify-center"
          aria-label="Close sidebar"
        >
          <X size={17} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map(({ to, label, icon: Icon, disabled }) => (
          <NavLink
            key={`${label}-${to}`}
            to={disabled ? `${basePath}/403` : `${basePath}${to}`}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium transition-colors group ${
                isActive
                  ? isExecutive ? "text-blue-700" : isStudent ? "text-sky-600" : "text-primary"
                  : isExecutive ? "text-slate-500 hover:text-blue-700 hover:bg-blue-50" : "text-slate-500 hover:text-dark hover:bg-slate-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className={`absolute inset-0 rounded-xl2 ${isExecutive ? "bg-blue-50" : isStudent ? "bg-sky-50" : "bg-primary-50"}`}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={19} className="relative shrink-0" />
                {!sidebarCollapsed && <span className="relative whitespace-nowrap">{label}</span>}
                {!sidebarCollapsed && label === "Notifications" && unreadCount > 0 && (
                  <span className="relative ml-auto bg-danger text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`px-3 pb-4 space-y-1 border-t pt-3 ${isExecutive ? "border-blue-100" : isStudent ? "border-sky-100" : "border-slate-100"}`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium text-danger hover:bg-red-50 transition-colors"
        >
          <LogOut size={19} className="shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-dark transition-colors"
        >
          {sidebarCollapsed ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
      </motion.aside>
    </>
  );
}
