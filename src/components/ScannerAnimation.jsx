import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";

export default function ScannerAnimation({ status = "waiting" }) {
  const isConnected = status !== "offline";

  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto">
      <div className="absolute inset-0 rounded-xl3 bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-blue-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37,99,235,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.4) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* corner brackets */}
        {["top-4 left-4 border-t-2 border-l-2", "top-4 right-4 border-t-2 border-r-2", "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"].map(
          (cls, i) => <div key={i} className={`absolute w-8 h-8 border-primary rounded-sm ${cls}`} />
        )}

        {isConnected && (
          <motion.div
            className="absolute left-4 right-4 h-0.5 bg-primary shadow-[0_0_12px_4px_rgba(37,99,235,0.6)]"
            animate={{ top: ["10%", "88%", "10%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={isConnected ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <ScanLine size={26} className="text-primary" />
          </motion.div>
          <p className="text-slate-600 text-sm font-medium">
            {isConnected ? "Waiting for QR..." : "Scanner Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
