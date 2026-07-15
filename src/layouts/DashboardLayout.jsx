import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

export default function DashboardLayout() {
  const location = useLocation();
  const { role } = useApp();
  const bgClass = role === "super-admin"
    ? "bg-gradient-to-br from-blue-50 via-white to-cyan-50"
    : role === "student"
      ? "bg-gradient-to-br from-sky-50 via-white to-cyan-50"
      : "bg-surface bg-grad-mesh";

  return (
    <div className={`flex min-h-screen ${bgClass}`}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
