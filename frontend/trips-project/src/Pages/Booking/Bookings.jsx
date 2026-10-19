import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OperatorLayout from '../../Layout/OperatorLayout';
import { useBookings } from '../../hooks/useBookings';
import { bookingsService } from '../../services/bookings';
import BookingsHeading from './components/BookingsHeading';
import StatsCards from './components/StatsCards';
import BookingFilters from './components/BookingFilters';
import BookingsTable from './components/BookingsTable';
import Pagination from './components/Pagination';
import DiagnosticsPanel from './components/DiagnosticsPanel';

const DEFAULT_QUERY = { status: 'all', expeditionId: 'all', window: '30d', page: 1, limit: 5 };

export default function Bookings() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [selected, setSelected] = useState(new Set(['1']));
  const { data, stats, loading, error, reload } = useBookings(query);
  const items = data?.items ?? [];

  const patch = (p) => setQuery((q) => ({ ...q, ...p }));
  const toggle = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((s) => (items.every((b) => s.has(b.id)) ? new Set() : new Set(items.map((b) => b.id))));

  const run = async (fn) => {
    await fn();
    setSelected(new Set());
    await reload();
  };
  const onConfirm = (b) => run(() => bookingsService.confirm(b.id));
  const onReject = (b) => run(() => bookingsService.reject(b.id));
  const onBulk = () => run(() => bookingsService.bulkConfirm([...selected]));
  const onExport = () => window.open(bookingsService.exportUrl('csv'), '_blank');

  return (
    <OperatorLayout crumbs={[{ label: 'Operator Workspace', to: '/dashboard' }, { label: 'Bookings' }]}>
      <BookingsHeading selectedCount={selected.size} onExport={onExport} onBulkConfirm={onBulk} />
      <StatsCards stats={stats} />
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <BookingFilters
          query={query}
          counts={data?.counts}
          onChange={patch}
          onClear={() => setQuery(DEFAULT_QUERY)}
        />
        <div className="-mx-4 border-t border-slate-200">
          <BookingsTable
            items={items}
            loading={loading}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onView={(b) => navigate(`/bookings/${b.id}`)}
            onConfirm={onConfirm}
            onReject={onReject}
          />
          <Pagination
            page={query.page}
            limit={query.limit}
            total={data?.total ?? 0}
            onChange={(page) => patch({ page })}
          />
        </div>
      </div>
      <DiagnosticsPanel
        error={error}
        onRetry={reload}
        onResetFilters={() => setQuery(DEFAULT_QUERY)}
        onBrowseAll={() => patch({ status: 'all', page: 1 })}
      />
    </OperatorLayout>
  );
}