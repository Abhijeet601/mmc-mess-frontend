const MAP = {
  Active: "bg-green-50 text-success",
  Success: "bg-green-50 text-success",
  Online: "bg-green-50 text-success",
  Disabled: "bg-slate-100 text-slate-500",
  Suspended: "bg-red-50 text-danger",
  Duplicate: "bg-amber-50 text-warning",
  Failed: "bg-red-50 text-danger",
  Issued: "bg-green-50 text-success",
  Expired: "bg-red-50 text-danger",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${MAP[status] || "bg-slate-100 text-slate-500"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
