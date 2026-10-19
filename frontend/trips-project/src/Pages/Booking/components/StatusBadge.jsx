import { BadgeCheck, Clock, CalendarClock, CircleCheck, XCircle } from 'lucide-react';
const map = {
    confirmed: { label: 'Confirmed', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: BadgeCheck },
    pending: { label: 'Pending Action', cls: 'bg-red-50 text-red-700 border-red-200', icon: Clock },
    upcoming: { label: 'Upcoming', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CalendarClock },
    completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: CircleCheck },
    cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};
export default function StatusBadge({ booking }) {
    const { label, cls, icon: Icon } = map[booking.status];
    const text = booking.status === 'upcoming' && booking.upcomingInDays != null ? `Upcoming in ${booking.upcomingInDays}d` : label;
    return (<span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      <Icon size={12}/> {text}
    </span>);
}
