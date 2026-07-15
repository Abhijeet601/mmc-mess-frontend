import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-transparent focus:border-primary-100 focus:bg-white rounded-xl2 pl-10 pr-9 py-2.5 text-sm outline-none transition-colors"
      />
      {value && (
        <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dark">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
