import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
export default function Topbar({ crumbs = [] }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-800 text-[10px] font-bold text-white">
          T
        </span>
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-slate-400">›</span>}
            {c.to ? (
              <Link to={c.to} className="hover:text-slate-800 transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800">{c.label}</span>
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full border border-slate-200 bg-slate-50/60 px-3 py-1 text-xs font-semibold text-slate-700">
          $1 USD = 48.75 EGP
        </span>
        <button
          type="button"
          className="relative text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900 text-white shadow-sm">
          <User size={14} />
        </span>
      </div>
    </header>
  );
}
