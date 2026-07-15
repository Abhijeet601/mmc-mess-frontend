import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/login"), 350);
          return 100;
        }
        return p + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(37,99,235,0.16) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="w-24 h-24 rounded-xl3 bg-grad-primary flex items-center justify-center shadow-floating relative z-10"
      >
        <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <UtensilsCrossed size={40} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 text-center relative z-10">
        <h1 className="font-display text-2xl font-semibold text-dark">Magadh Mahila College</h1>
        <p className="text-slate-400 text-sm mt-1">Patna University | Smart Hostel Mess Attendance</p>
      </motion.div>

      <div className="w-56 h-1.5 bg-blue-100 rounded-full mt-8 overflow-hidden relative z-10">
        <motion.div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-slate-500 text-xs mt-3 font-mono relative z-10">Loading system · {progress}%</p>
    </div>
  );
}
