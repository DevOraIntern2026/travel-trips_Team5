import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Compass, Ticket, UserCog, LogOut } from 'lucide-react';

const NAV = [
  { label: 'Dashboard', icon: LayoutGrid, to: '/dashboard' },
  { label: 'Trips', icon: Compass, to: '/trips/edit' },
  { label: 'Bookings', icon: Ticket, to: '/bookings' },
  { label: 'Profile', icon: UserCog, to: '/profile' },
];

export default function Sidebar({ onLogout }) {
  const { pathname } = useLocation();
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-[#072d27] text-white">
      {/* Brand Header */}
      <Link
        to="/"
        className="flex items-center gap-3 border-b border-[#0f433b] px-5 py-4 transition-colors hover:bg-white/5 group cursor-pointer"
        title="Return to Home"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#072d27] font-bold text-xs shadow group-hover:scale-105 transition-transform">
          <span>T</span>
        </div>
        <div>
          <b className="block text-sm font-bold tracking-tight text-white leading-tight group-hover:text-emerald-200 transition-colors">
            TravelOra
          </b>
          <span className="block text-[9px] font-semibold tracking-wider text-[#79a99f] uppercase leading-tight">
            OPERATOR WORKSPACE
          </span>
        </div>
      </Link>

      {/* Nav list */}
      <nav className="flex flex-1 flex-col gap-1.5 p-3">
        {NAV.map(({ label, icon: Icon, to }) => {
          const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs transition-colors ${
                isActive
                  ? 'bg-[#134e45] font-semibold text-white shadow-sm'
                  : 'font-medium text-[#9cc2ba] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-[#9cc2ba]'} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-[#0f433b]">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#9cc2ba] hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
