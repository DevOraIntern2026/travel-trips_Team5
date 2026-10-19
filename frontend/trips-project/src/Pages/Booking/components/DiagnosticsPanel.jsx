import { FilterX, AlertTriangle, RefreshCw } from 'lucide-react';
export default function DiagnosticsPanel({ onResetFilters, onBrowseAll, onRetry, emptyStatus = 'Pending', error }) {
    return (<section className="mt-6 rounded-xl border border-slate-200 bg-slate-100/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Operator System Diagnostics &amp; Edge States</h2>
        <button className="text-[11px] font-medium text-brand-800">Toggle Diagnostics View</button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-5 text-center">
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-slate-500"><FilterX size={18}/></span>
          <p className="text-sm font-bold text-slate-900">No Matching Reservations</p>
          <p className="mt-1 text-[11px] text-slate-500">No bookings found matching status <span className="font-semibold text-red-600">'{emptyStatus}'</span> for 'Siwa Oasis'.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={onResetFilters} className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600">Reset Filters</button>
            <button onClick={onBrowseAll} className="rounded-md bg-brand-900 px-3 py-1.5 text-[11px] font-semibold text-white">Browse All 34</button>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">Network Skeleton Preview <span className="text-red-500">● Polling</span></p>
          {[0, 1, 2].map((i) => (<div key={i} className="mb-2 flex items-center gap-2"><span className="h-7 w-7 animate-pulse rounded-full bg-slate-200"/><span className="h-3 flex-1 animate-pulse rounded bg-slate-200"/></div>))}
          <p className="mt-3 text-[10px] text-slate-400">Realtime sync frequency: 15s</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-white p-4">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-red-700"><AlertTriangle size={14}/> Gateway Sync Notice</p>
          <p className="text-[11px] text-slate-500">{error ?? 'Egyptian Tourism Ministry permit gateway responded with HTTP 504 (Gateway Timeout). Stored reservations queued locally.'}</p>
          <button onClick={onRetry} className="mt-3 ml-auto flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700"><RefreshCw size={11}/> Retry Connection</button>
        </div>
      </div>
    </section>);
}