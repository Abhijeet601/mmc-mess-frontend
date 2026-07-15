import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useApp } from "../context/AppContext";

const roleBase = {
  "super-admin": "/super-admin",
  admin: "/admin",
  student: "/student",
};

export default function AccessDenied() {
  const { role } = useApp();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center card-surface rounded-xl3 p-8 shadow-soft">
        <div className="mx-auto w-14 h-14 rounded-xl3 bg-red-50 text-danger flex items-center justify-center">
          <LockKeyhole size={26} />
        </div>
        <p className="font-display text-5xl font-semibold text-dark mt-6">403</p>
        <h1 className="font-display text-2xl font-semibold text-dark mt-2">Access Denied</h1>
        <p className="text-sm text-slate-500 mt-3">You don't have permission to access this page.</p>
        <Link to={`${roleBase[role] || "/admin"}/dashboard`} className="inline-flex mt-6 rounded-xl2 bg-primary text-white px-5 py-3 text-sm font-semibold">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
