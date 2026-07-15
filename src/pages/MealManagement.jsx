import { useEffect, useState } from "react";
import { Coffee, Cookie, Moon, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../lib/api";
import { useApp } from "../context/AppContext";

const TYPES = [["breakfast","Breakfast",Coffee],["lunch","Lunch",UtensilsCrossed],["snacks","Snacks",Cookie],["dinner","Dinner",Moon]];
const iso = (d) => d.toISOString().slice(0,10);

export default function MealManagement() {
  const { role } = useApp(); const editable = role !== "student";
  const [menus,setMenus] = useState([]); const [weekStart,setWeekStart] = useState("");
  const load = () => apiRequest("/meal-menus").then((r) => { setMenus(r.menus); setWeekStart(r.week_start); }).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, []);
  const start = weekStart ? new Date(`${weekStart}T00:00:00`) : new Date();
  const days = Array.from({length:7},(_,i) => { const d=new Date(start); d.setDate(d.getDate()+i); const found=menus.find((m)=>String(m.menu_date).slice(0,10)===iso(d)); return { menu_date:iso(d), breakfast:"", lunch:"", snacks:"", dinner:"", ...found }; });
  const save = async (menu) => { try { await apiRequest("/admin/meal-menus",{method:"PUT",body:JSON.stringify(menu)}); toast.success("Meal menu saved"); load(); } catch(e){toast.error(e.message);} };
  const update = (date,key,value) => setMenus((old) => { const exists=old.some((m)=>String(m.menu_date).slice(0,10)===date); return exists ? old.map((m)=>String(m.menu_date).slice(0,10)===date?{...m,[key]:value}:m) : [...old,{menu_date:date,breakfast:"",lunch:"",snacks:"",dinner:"",[key]:value}]; });
  const today = days.find((d)=>d.menu_date===iso(new Date())) || days[0];
  return <div className="space-y-6"><div><h1 className="font-display text-2xl font-semibold text-dark">Meal Menu</h1><p className="text-sm text-slate-400">{editable ? "Create and update the weekly mess menu." : "Today's meals and the complete weekly menu."}</p></div>
    <section className="rounded-xl3 border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 shadow-soft"><h2 className="font-display font-semibold text-dark">Today · {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</h2><div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">{TYPES.map(([key,label,Icon])=><div key={key} className="rounded-xl2 bg-white p-4 border border-sky-50"><Icon size={18} className="text-sky-600"/><p className="mt-3 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-dark">{today?.[key] || "Menu not published"}</p></div>)}</div></section>
    <section className="rounded-xl3 border border-slate-100 bg-white p-5 shadow-soft"><h2 className="font-display font-semibold text-dark">Weekly menu</h2><div className="mt-4 grid grid-cols-1 xl:grid-cols-7 gap-3">{days.map((day)=><div key={day.menu_date} className="rounded-xl2 border border-slate-100 p-3"><p className="font-semibold text-dark">{new Date(`${day.menu_date}T00:00:00`).toLocaleDateString("en-IN",{weekday:"short",day:"numeric"})}</p><div className="mt-3 space-y-3">{TYPES.map(([key,label])=><label key={key} className="block text-[10px] font-semibold uppercase text-slate-400">{label}{editable?<textarea rows="2" value={day[key]||""} onChange={(e)=>update(day.menu_date,key,e.target.value)} className="mt-1 w-full resize-none rounded-lg bg-slate-50 p-2 text-xs font-normal normal-case text-dark outline-none"/>:<p className="mt-1 text-xs font-medium normal-case text-dark">{day[key]||"—"}</p>}</label>)}</div>{editable&&<button onClick={()=>save(day)} className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">Save day</button>}</div>)}</div></section></div>;
}
