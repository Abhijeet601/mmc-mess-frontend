import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import NotificationCard from "../components/NotificationCard";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";

export default function Notifications() {
  const { notifs, markAllRead, markRead, unreadCount } = useApp();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <motion.div animate={unreadCount > 0 ? { rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }} className="w-11 h-11 rounded-xl2 bg-primary-50 text-primary flex items-center justify-center">
            <Bell size={20} />
          </motion.div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-dark">Notifications</h1>
            <p className="text-slate-400 text-sm mt-0.5">{unreadCount} unread updates</p>
          </div>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 bg-slate-100 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-xl2">
          <CheckCheck size={15} /> Mark all as read
        </button>
      </div>

      {notifs.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New announcements and reminders will show up here." />
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <NotificationCard key={n.id} notif={n} onClick={() => markRead(n.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
