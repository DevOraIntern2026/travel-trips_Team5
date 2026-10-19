import { Download, CheckCheck } from 'lucide-react';
export default function BookingsHeading({ selectedCount, onExport, onBulkConfirm }) {
    return (<div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brand-800">
          <span className="text-red-500">●</span> Operator Command • Live Telemetry
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900">Bookings &amp; Manifest Control</h1>
        <p className="mt-1 max-w-md text-xs text-slate-500">
          Real-time reservation manifest for Sheikh Salem Al-Jabali Expeditions. Synchronized directly with customer booking lifecycles and seat quotas.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onExport} className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
          <Download size={13}/> Export Manifest (CSV/PDF)
        </button>
        <button onClick={onBulkConfirm} disabled={selectedCount === 0} className="flex items-center gap-1.5 rounded-md bg-brand-800 px-3 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40">
          <CheckCheck size={13}/> Bulk Confirm Selected ({selectedCount})
        </button>
      </div>
    </div>);
}
