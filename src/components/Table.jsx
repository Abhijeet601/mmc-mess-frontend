export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto rounded-xl2 border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">{children}</tbody>
      </table>
    </div>
  );
}
