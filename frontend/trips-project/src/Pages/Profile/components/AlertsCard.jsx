import { Check } from 'lucide-react';
const rows = [
    { key: 'instantBooking', title: 'Instant Booking Alert (Email & SMS)', desc: 'Direct ping whenever a traveler secures a seat on a guided expedition.' },
    { key: 'whatsappPing', title: 'WhatsApp Field Dispatch Ping', desc: 'Automated daily departure manifest and border permit clearances sent to WhatsApp.' },
    { key: 'seatCapacity', title: 'Seat Capacity Warnings', desc: 'High-demand scarcity alerts triggered when a trek reaches 80% and 100% capacity.' },
    { key: 'escrowSettlement', title: 'Escrow Bond Settlement Notices', desc: 'Instant confirmation when client booking funds clear escrow and route to local bank.' },
    { key: 'marketplaceDigest', title: 'TravelOra Marketplace Digest', desc: 'Monthly tourism insights, regional rate benchmarks, and gear partnership offers.' },
];
export default function AlertsCard({ value, onChange }) {
    return (<section className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Real-Time Dispatch</p>
      <h2 className="mb-3 text-base font-bold text-slate-900">Booking &amp; Field Alerts</h2>
      <div className="space-y-3">
        {rows.map((r) => (<label key={r.key} className="flex cursor-pointer gap-2.5">
            <input type="checkbox" className="peer sr-only" checked={value[r.key]} onChange={() => onChange({ ...value, [r.key]: !value[r.key] })}/>
            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-slate-400 text-white peer-checked:border-brand-900 peer-checked:bg-brand-900"><Check size={10} className={value[r.key] ? '' : 'hidden'}/></span>
            <span>
              <span className="block text-[11px] font-bold text-slate-900">{r.title}</span>
              <span className="block text-[10px] leading-snug text-slate-500">{r.desc}</span>
            </span>
          </label>))}
      </div>
    </section>);
}
