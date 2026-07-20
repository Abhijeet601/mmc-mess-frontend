import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Coffee, Cookie, Moon, Save, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../lib/api";
import { useApp } from "../context/AppContext";

const TYPES = [
  ["breakfast", "Breakfast", Coffee],
  ["lunch", "Lunch", UtensilsCrossed],
  ["snacks", "Snacks", Cookie],
  ["dinner", "Dinner", Moon],
];

const iso = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const mondayOf = (value) => {
  const date = new Date(value);
  const weekday = date.getDay() || 7;
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - weekday + 1);
  return date;
};

const emptyMenu = (menuDate) => ({
  menu_date: menuDate,
  breakfast: "",
  lunch: "",
  snacks: "",
  dinner: "",
});

export default function MealManagement() {
  const { role } = useApp();
  const editable = role === "admin" || role === "super-admin";
  const [menus, setMenus] = useState([]);
  const [weekStart, setWeekStart] = useState(iso(mondayOf(new Date())));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = (start) => {
    setLoading(true);
    return apiRequest(`/meal-menus?week_start=${encodeURIComponent(start)}`)
      .then((result) => {
        setMenus(result.menus || []);
        setWeekStart(String(result.week_start));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(weekStart); }, [weekStart]);

  const start = new Date(`${weekStart}T12:00:00`);
  const days = Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(current.getDate() + index);
    const menuDate = iso(current);
    const found = menus.find((menu) => String(menu.menu_date).slice(0, 10) === menuDate);
    return { ...emptyMenu(menuDate), ...found };
  });

  const update = (menuDate, key, value) => setMenus((current) => {
    const exists = current.some((menu) => String(menu.menu_date).slice(0, 10) === menuDate);
    if (!exists) return [...current, { ...emptyMenu(menuDate), [key]: value }];
    return current.map((menu) => String(menu.menu_date).slice(0, 10) === menuDate ? { ...menu, [key]: value } : menu);
  });

  const save = async (menu, quiet = false) => {
    await apiRequest("/admin/meal-menus", { method: "PUT", body: JSON.stringify(menu) });
    if (!quiet) toast.success("Meal menu saved");
  };

  const saveDay = async (menu) => {
    try { await save(menu); await load(weekStart); } catch (error) { toast.error(error.message); }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(days.map((menu) => save(menu, true)));
      toast.success("Weekly meal menu saved");
      await load(weekStart);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const moveWeek = (amount) => {
    const next = new Date(`${weekStart}T12:00:00`);
    next.setDate(next.getDate() + amount * 7);
    setWeekStart(iso(next));
  };

  const today = days.find((day) => day.menu_date === iso(new Date()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-dark">Meal Menu</h1>
          <p className="text-sm text-slate-400">{editable ? "Create and update the weekly mess menu." : "View today's meals and the complete weekly menu."}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveWeek(-1)} aria-label="Previous week" className="rounded-xl2 border border-slate-200 bg-white p-2.5 text-slate-600"><ChevronLeft size={17} /></button>
          <button type="button" onClick={() => setWeekStart(iso(mondayOf(new Date())))} className="rounded-xl2 border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600">Current week</button>
          <button type="button" onClick={() => moveWeek(1)} aria-label="Next week" className="rounded-xl2 border border-slate-200 bg-white p-2.5 text-slate-600"><ChevronRight size={17} /></button>
        </div>
      </div>

      <section className="rounded-xl3 border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 shadow-soft">
        <h2 className="font-display font-semibold text-dark">Today · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {TYPES.map(([key, label, Icon]) => <div key={key} className="rounded-xl2 border border-sky-50 bg-white p-4"><Icon size={18} className="text-sky-600" /><p className="mt-3 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-dark">{today?.[key] || "Menu not published"}</p></div>)}
        </div>
      </section>

      <section className="rounded-xl3 border border-slate-100 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="font-display font-semibold text-dark">Weekly menu</h2><p className="mt-1 text-xs text-slate-400">Week of {start.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>
          {editable && <button type="button" disabled={saving || loading} onClick={saveAll} className="flex items-center gap-2 rounded-xl2 bg-primary px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60"><Save size={15} />{saving ? "Saving..." : "Save all"}</button>}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-7">
          {days.map((day) => <div key={day.menu_date} className="rounded-xl2 border border-slate-100 p-3"><p className="font-semibold text-dark">{new Date(`${day.menu_date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}</p><div className="mt-3 space-y-3">{TYPES.map(([key, label]) => <label key={key} className="block text-[10px] font-semibold uppercase text-slate-400">{label}{editable ? <textarea rows="2" value={day[key] || ""} onChange={(event) => update(day.menu_date, key, event.target.value)} className="mt-1 w-full resize-none rounded-lg bg-slate-50 p-2 text-xs font-normal normal-case text-dark outline-none focus:ring-2 focus:ring-primary/20" /> : <p className="mt-1 text-xs font-medium normal-case text-dark">{day[key] || "—"}</p>}</label>)}</div>{editable && <button type="button" onClick={() => saveDay(day)} className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">Save day</button>}</div>)}
        </div>
      </section>
    </div>
  );
}
