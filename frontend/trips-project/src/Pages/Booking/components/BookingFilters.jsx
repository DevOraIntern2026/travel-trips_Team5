import { Search } from 'lucide-react';
const pills = [
    { key: 'all', label: 'All', dot: '' },
    { key: 'pending', label: 'Pending', dot: 'bg-red-500' },
    { key: 'confirmed', label: 'Confirmed', dot: 'bg-emerald-500' },
    { key: 'upcoming', label: 'Upcoming', dot: 'bg-blue-500' },
    { key: 'completed', label: 'Completed', dot: 'bg-slate-400' },
    { key: 'cancelled', label: 'Cancelled / Rejected', dot: 'bg-red-300' },
];
const select = 'h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:border-brand-800 focus:outline-none';
const lbl = 'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500';
export default function BookingFilters({ query, counts, onChange, onClear }) {
    return (<div className="mb-4">
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div>
          <label className={lbl}>Search Bookings</label>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={query.search ?? ''} onChange={(e) => onChange({ search: e.target.value, page: 1 })} placeholder="Search by Booking ID (e.g. #BK-7842)" className="h-9 w-full rounded-md border border-slate-200 bg-white pl-8 pr-2 text-xs focus:border-brand-800 focus:outline-none"/>
          </div>
        </div>
        <div>
          <label className={lbl}>Status</label>
          <select className={select} value={query.status ?? 'all'} onChange={(e) => onChange({ status: e.target.value, page: 1 })}>
            <option value="all">All Statuses</option>
            {pills.slice(1).map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Expedition</label>
          <select className={select} value={query.expeditionId ?? 'all'} onChange={(e) => onChange({ expeditionId: e.target.value, page: 1 })}>
            <option value="all">All Trips</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Window</label>
          <select className={select} value={query.window ?? '30d'} onChange={(e) => onChange({ window: e.target.value, page: 1 })}>
            <option value="30d">Next 30 Days</option>
            <option value="90d">Next 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <button onClick={onClear} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50">Clear Filters</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pills.map((p) => {
            const active = (query.status ?? 'all') === p.key;
            return (<button key={p.key} onClick={() => onChange({ status: p.key, page: 1 })} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${active ? 'border-brand-800 bg-brand-800 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {p.dot && <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`}/>}
              {p.label} ({counts?.[p.key] ?? 0})
            </button>);
        })}
      </div>
    </div>);
}
