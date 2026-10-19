import BookingRow from './BookingRow';
const th = 'px-2 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500';
export default function BookingsTable({ items, loading, selected, onToggle, onToggleAll, ...actions }) {
    const allChecked = items.length > 0 && items.every((b) => selected.has(b.id));
    return (<div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50/60">
          <tr>
            <th className="py-3 pl-4"><input type="checkbox" checked={allChecked} onChange={onToggleAll} className="h-3.5 w-3.5 accent-brand-800"/></th>
            <th className={th}>Booking ID</th>
            <th className={th}>Traveler Profile</th>
            <th className={th}>Expedition &amp; Route</th>
            <th className={th}>Departure Window</th>
            <th className={th}>Pax</th>
            <th className={`${th} text-right`}>Escrow Locked</th>
            <th className={th}>Status</th>
            <th className={`${th} pr-4 text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className={loading ? 'opacity-50' : ''}>
          {items.map((b, i) => (<BookingRow key={b.id} booking={b} index={i} selected={selected.has(b.id)} onSelect={() => onToggle(b.id)} {...actions}/>))}
        </tbody>
      </table>
    </div>);
}
