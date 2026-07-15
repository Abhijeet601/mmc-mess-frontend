import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const mv = useMotionValue(0);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [mv, value]);

  return <>{display.toLocaleString("en-IN")}</>;
}

export default function StatCard({ label, value, icon: Icon, color = "primary", suffix = "", trend }) {
  const colorMap = {
    primary: "bg-primary-50 text-primary",
    success: "bg-green-50 text-success",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
    dark: "bg-slate-100 text-dark",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card-surface rounded-xl3 p-5 shadow-soft flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl2 flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={19} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50 text-success" : "bg-red-50 text-danger"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-semibold text-dark tabular-nums">
          <AnimatedNumber value={value} />{suffix}
        </p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}
