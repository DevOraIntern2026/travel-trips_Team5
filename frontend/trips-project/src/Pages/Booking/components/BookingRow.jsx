import { BadgeCheck, MoreVertical } from 'lucide-react';
import StatusBadge from './StatusBadge';
const escrowLabel = {
    held: { text: '🔒 Held', cls: 'text-slate-500' },
    uncommitted: { text: '⏳ Uncommitted', cls: 'text-red-600' },
    active: { text: '🛡 Escrow Active', cls: 'text-emerald-700' },
    settled: { text: '✔ Settled', cls: 'text-slate-500' },
    refunded: { text: 'Refund Processed', cls: 'text-red-600' },
};
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const avatarTones = ['bg-emerald-100 text-emerald-700', 'bg-orange-100 text-orange-700', 'bg-teal-100 text-teal-700', 'bg-indigo-100 text-indigo-700', 'bg-rose-100 text-rose-700'];
export default function BookingRow({ booking: b, index, selected, onSelect, onView, onConfirm, onReject }) {
    const cancelled = b.status === 'cancelled';
    const btn = 'rounded-md px-3 py-1.5 text-[11px] font-semibold';
    return (<tr className={`border-b border-slate-100 align-middle ${cancelled ? 'opacity-70' : ''}`}>
      <td className="py-3 pl-4"><input type="checkbox" checked={selected} onChange={onSelect} className="h-3.5 w-3.5 accent-brand-800"/></td>
      <td className="px-2 text-[11px]">
        <p className={`font-semibold ${b.status === 'pending' ? 'text-brand-800' : 'text-brand-800'}`}>#{b.code}</p>
        <p className={`text-[10px] ${b.isNew || cancelled ? 'text-red-600' : 'text-slate-400'}`}>{b.sourceNote}</p>
      </td>
      <td className="px-2">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarTones[index % avatarTones.length]}`}>{initials(b.traveler.name)}</span>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[13px] font-bold text-slate-900">{b.traveler.name}{b.traveler.verified && <BadgeCheck size={12} className="text-brand-800"/>}</p>
            <p className="truncate text-[10px] text-slate-500">{b.traveler.email}</p>
            <p className="text-[9px] text-slate-400">{b.traveler.note}</p>
          </div>
        </div>
      </td>
      <td className="px-2">
        <p className="text-[13px] font-bold text-slate-900">{b.expedition.title}</p>
        <p className="text-[10px] text-slate-400">#{b.expedition.code} • {b.expedition.route}</p>
      </td>
      <td className="px-2">
        <p className="text-[13px] font-bold text-slate-900">{fmtDate(b.departure.from)} – {fmtDate(b.departure.to)}</p>
        <p className="text-[10px] text-slate-400">{b.departure.days} Days / {b.departure.nights} Nights</p>
      </td>
      <td className="px-2">
        <span className="inline-flex flex-col items-center rounded-md bg-indigo-50 px-2.5 py-1 text-[13px] font-bold text-slate-900">{b.pax}<span className="text-[9px] font-medium text-slate-500">Pax</span></span>
      </td>
      <td className="px-2 text-right">
        <p className={`text-[13px] font-bold text-slate-900 ${cancelled ? 'line-through opacity-60' : ''}`}>{b.escrow.egp.toLocaleString('en-US')} EGP</p>
        <p className="text-[10px] text-slate-400">${b.escrow.usd.toFixed(2)} USD</p>
        <p className={`text-[10px] font-semibold ${escrowLabel[b.escrow.state].cls}`}>{escrowLabel[b.escrow.state].text}</p>
      </td>
      <td className="px-2"><StatusBadge booking={b}/></td>
      <td className="px-2 pr-4">
        <div className="flex items-center justify-end gap-2">
          {b.status === 'confirmed' && <button onClick={() => onView(b)} className={`${btn} bg-brand-900 text-white`}>View Detail</button>}
          {b.status === 'pending' && (<>
            <button onClick={() => onConfirm(b)} className={`${btn} bg-brand-800 text-white`}>Confirm</button>
            <button onClick={() => onReject(b)} className={`${btn} bg-red-50 text-red-700`}>Reject</button>
          </>)}
          {b.status === 'upcoming' && <button onClick={() => onView(b)} className={`${btn} bg-indigo-50 text-indigo-700`}>Print Manifest</button>}
          {b.status === 'completed' && <button onClick={() => onView(b)} className={`${btn} bg-indigo-50 text-indigo-700`}>Receipt</button>}
          {cancelled && <button onClick={() => onView(b)} className={`${btn} bg-slate-100 text-slate-600`}>View Detail</button>}
          <button className="text-slate-400 hover:text-slate-700" aria-label="More actions"><MoreVertical size={14}/></button>
        </div>
      </td>
    </tr>);
}
