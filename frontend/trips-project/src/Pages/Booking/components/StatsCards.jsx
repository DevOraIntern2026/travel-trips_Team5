import { Layers, Clock, CheckCircle2, Lock } from 'lucide-react';
const fmt = (n) => n.toLocaleString('en-US');
export default function StatsCards({ stats }) {
    if (!stats)
        return <div className="mb-5 grid grid-cols-4 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-white"/>)}</div>;
    const card = 'rounded-xl border border-slate-200 bg-white p-4';
    const label = 'flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500';
    return (<div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className={card}>
        <div className={label}>
          <span>Total Bookings</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Layers size={14}/></span>
        </div>
        <p className="mt-3 text-4xl font-extrabold text-slate-900">{stats.total}</p>
        <p className="mt-1 text-[10px] text-slate-400">🕒 Updated {stats.updatedMinutesAgo}m ago</p>
      </div>
      <div className={card}>
        <div className={`${label} text-red-700`}>
          <span>Pending Confirmation</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock size={14}/></span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-4xl font-extrabold text-slate-900">{stats.pending}</p>
          <span className="mb-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Needs Action</span>
        </div>
        {stats.pendingExpiringHours != null && <p className="mt-1 text-[10px] text-red-600">Expiring &lt;{stats.pendingExpiringHours} hrs</p>}
        <div className="mt-2 h-1 rounded bg-slate-100"><div className="h-1 w-1/4 rounded bg-red-500"/></div>
      </div>
      <div className={card}>
        <div className={label}>
          <span>Confirmed &amp; Upcoming</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 size={14}/></span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-4xl font-extrabold text-slate-900">{stats.confirmedUpcoming}</p>
          <span className="mb-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Manifest Active</span>
        </div>
        <div className="mt-3 h-1 rounded bg-slate-100"><div className="h-1 w-3/4 rounded bg-brand-800"/></div>
      </div>
      <div className={card}>
        <div className={label}>
          <span>Escrow Guaranteed</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><Lock size={14}/></span>
        </div>
        <p className="mt-3 text-3xl font-extrabold text-slate-900">{fmt(stats.escrowEgp)} <span className="text-xl">EGP</span></p>
        <p className="mt-1 text-[10px] text-slate-400">≈ ${fmt(stats.escrowUsd)} USD locked transit</p>
        <div className="mt-2 h-1 rounded bg-brand-800"/>
      </div>
    </div>);
}
