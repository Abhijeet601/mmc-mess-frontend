import { motion } from "framer-motion";
import { Megaphone, Clock3, PartyPopper } from "lucide-react";

const ICONS = { announcement: Megaphone, reminder: Clock3, holiday: PartyPopper };
const COLORS = {
  announcement: "bg-primary-50 text-primary",
  reminder: "bg-amber-50 text-warning",
  holiday: "bg-green-50 text-success",
};

export default function NotificationCard({ notif, onClick }) {
  const Icon = ICONS[notif.type] || Megaphone;
  return (
    <motion.div
      layout
      whileHover={{ x: 3 }}
      onClick={onClick}
      className={`flex gap-3 p-4 rounded-xl2 cursor-pointer border transition-colors ${
        notif.unread ? "bg-primary-50/40 border-primary-100" : "bg-white border-slate-100 hover:bg-slate-50"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl2 flex items-center justify-center shrink-0 ${COLORS[notif.type]}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-dark truncate">{notif.title}</p>
          {notif.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.body}</p>
        <p className="text-[11px] text-slate-400 mt-1.5">{notif.time}</p>
      </div>
    </motion.div>
  );
}
