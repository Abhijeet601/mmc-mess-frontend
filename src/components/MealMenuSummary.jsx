import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function MealMenuSummary() {
  const [today,setToday]=useState(null);
  useEffect(()=>{apiRequest("/meal-menus").then((r)=>setToday(r.menus.find((m)=>String(m.menu_date).slice(0,10)===new Date().toISOString().slice(0,10)))).catch(()=>{});},[]);
  const meals=[["Breakfast","breakfast"],["Lunch","lunch"],["Snacks","snacks"],["Dinner","dinner"]];
  return <section className="rounded-xl3 border border-sky-100 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div><h2 className="font-display font-semibold text-dark">Today’s Mess Menu</h2><p className="text-xs text-slate-400">Breakfast through dinner</p></div><Link to="/student/meals" className="text-xs font-semibold text-sky-600">Weekly view →</Link></div><div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">{meals.map(([label,key])=><div key={key} className="rounded-xl2 bg-sky-50/60 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-dark">{today?.[key]||"Menu not published"}</p></div>)}</div></section>;
}
