import { AlertTriangle } from 'lucide-react';
export default function DangerZone({ onPause, onDeactivate }) {
    return (<section className="rounded-xl border border-red-200 bg-red-50 p-5">
      <h2 className="mb-1 flex items-center gap-1.5 text-xs font-bold text-red-700"><AlertTriangle size={14}/> Operational Contingency &amp; Danger Zone</h2>
      <p className="mb-3 text-[11px] text-red-700/90">Temporarily pause your upcoming departures during seasonal mountain closures, flash floods, or Bedouin tribal council gatherings.</p>
      <div className="flex gap-2">
        <button onClick={onPause} className="flex-1 rounded-md border border-red-200 bg-white py-1.5 text-[11px] font-semibold text-red-700">Pause All Departures</button>
        <button onClick={onDeactivate} className="flex-1 rounded-md border border-red-200 bg-white py-1.5 text-[11px] font-semibold text-red-700">Request Deactivation</button>
      </div>
    </section>);
}
