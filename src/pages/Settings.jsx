import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, UtensilsCrossed, Clock, QrCode, ScanLine, ShieldCheck, Palette,
  User, DatabaseBackup, RotateCcw, Save,
} from "lucide-react";
import toast from "react-hot-toast";

const SECTIONS = [
  { id: "university", label: "College Details", icon: Building2 },
  { id: "mess", label: "Mess Details", icon: UtensilsCrossed },
  { id: "timing", label: "Meal Timing", icon: Clock },
  { id: "qr", label: "QR Settings", icon: QrCode },
  { id: "scanner", label: "Scanner Settings", icon: ScanLine },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "profile", label: "Profile", icon: User },
  { id: "backup", label: "Backup & Restore", icon: DatabaseBackup },
];

function Field({ label, defaultValue, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">{label}</label>
      <input type={type} defaultValue={defaultValue} className="w-full bg-slate-50 rounded-xl2 px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary-100" />
    </div>
  );
}

function Toggle({ label, defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <button onClick={() => setOn((v) => !v)} className={`w-11 h-6 rounded-full transition-colors relative ${on ? "bg-success" : "bg-slate-200"}`}>
        <motion.span animate={{ x: on ? 20 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
      </button>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState("university");

  const save = () => toast.success("Settings saved successfully");

  const CONTENT = {
    university: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="College Name" defaultValue="Magadh Mahila College" />
        <Field label="Campus Code" defaultValue="MMC-PATNA-01" />
        <Field label="Contact Email" defaultValue="hostel.office@magadhmahilacollege.org" />
        <Field label="Contact Number" defaultValue="+91 612 222 5555" />
      </div>
    ),
    mess: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Mess Name" defaultValue="MMC Hostel Mess" />
        <Field label="Mess Capacity" defaultValue="240" />
        <Field label="Contractor" defaultValue="Patna Campus Catering Services" />
        <Field label="Menu Cycle" defaultValue="Weekly" />
      </div>
    ),
    timing: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Breakfast Window" defaultValue="7:30 AM - 9:30 AM" />
        <Field label="Lunch Window" defaultValue="12:30 PM - 2:30 PM" />
        <Field label="Dinner Window" defaultValue="7:30 PM - 9:30 PM" />
      </div>
    ),
    qr: (
      <div className="space-y-1">
        <Toggle label="Auto-regenerate expired QR codes" />
        <Toggle label="Allow students to download their own QR" />
        <Toggle label="Watermark QR with hostel logo" defaultOn={false} />
        <div className="mt-3"><Field label="QR Validity (days)" defaultValue="365" /></div>
      </div>
    ),
    scanner: (
      <div className="space-y-1">
        <Toggle label="Enable duplicate scan detection" />
        <Toggle label="Play sound on successful scan" />
        <Toggle label="Auto-lock scanner after meal window" />
        <div className="mt-3"><Field label="Scan cooldown (seconds)" defaultValue="5" /></div>
      </div>
    ),
    security: (
      <div className="space-y-1">
        <Toggle label="Require 2-factor authentication for admins" />
        <Toggle label="Log all administrative actions" />
        <Toggle label="Session auto-timeout after 30 min" />
      </div>
    ),
    theme: (
      <div className="flex gap-3">
        {["#2563EB", "#22C55E", "#7C3AED", "#0F172A", "#F59E0B"].map((c) => (
          <button key={c} className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-slate-200" style={{ background: c }} onClick={save} />
        ))}
      </div>
    ),
    profile: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" defaultValue="Admin Priya" />
        <Field label="Email" defaultValue="mess.admin@magadhmahilacollege.org" />
        <Field label="New Password" type="password" defaultValue="" />
        <Field label="Confirm Password" type="password" defaultValue="" />
      </div>
    ),
    backup: (
      <div className="flex gap-3">
        <button onClick={() => toast.success("Backup created successfully")} className="flex items-center gap-2 bg-primary-50 text-primary text-sm font-semibold px-4 py-2.5 rounded-xl2">
          <DatabaseBackup size={15} /> Create Backup
        </button>
        <button onClick={() => toast.success("System restored from last backup")} className="flex items-center gap-2 bg-slate-100 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl2">
          <RotateCcw size={15} /> Restore
        </button>
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-dark">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your mess system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-surface rounded-xl3 p-3 shadow-soft h-fit space-y-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl2 text-sm font-medium transition-colors ${
                active === id ? "bg-primary-50 text-primary" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-3 card-surface rounded-xl3 p-6 shadow-soft">
          <h3 className="font-display font-semibold text-dark mb-5">{SECTIONS.find((s) => s.id === active)?.label}</h3>
          {CONTENT[active]}
          <button onClick={save} className="mt-6 flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl2 shadow-floating">
            <Save size={15} /> Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}
