import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function Pagination({ page, limit, total, onChange }) {
    const pages = Math.max(1, Math.ceil(total / limit));
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    const nav = 'flex h-7 w-7 items-center justify-center rounded text-slate-500 disabled:opacity-30';
    return (<div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500">
      <span>Showing {from} to {to} of {total} bookings</span>
      <div className="flex items-center gap-1">
        <button className={nav} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={14}/></button>
        {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5).map((p) => (<button key={p} onClick={() => onChange(p)} className={`h-7 w-7 rounded text-[11px] font-semibold ${p === page ? 'bg-brand-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>))}
        <button className={nav} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={14}/></button>
      </div>
    </div>);
}
