import { api } from '../lib/api';

const MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const mockItems = [
  {
    id: '1', code: 'BK-7842', status: 'confirmed', sourceNote: 'Cust. Checkout',
    traveler: { name: 'Tarek El-Sayed', email: 'tarek@sinai-expeditions.org', note: 'PASS #SIN-884', verified: true },
    expedition: { title: 'Sinai High', code: 'TRV-8942-EGY', route: 'St. Catherine Pass' },
    departure: { from: '2025-11-14', to: '2025-11-18', days: 5, nights: 4 },
    pax: 2, escrow: { egp: 24000, usd: 480, state: 'held' },
  },
  {
    id: '2', code: 'BK-7890', status: 'pending', sourceNote: 'New 12m ago', isNew: true,
    traveler: { name: 'Omar Al-Khatib', email: 'omar.khatib@cairo.eg', note: '+20 100 482 1190' },
    expedition: { title: 'Sinai High', code: 'TRV-8942-EGY', route: 'Summit Camp' },
    departure: { from: '2025-11-14', to: '2025-11-18', days: 5, nights: 4 },
    pax: 1, escrow: { egp: 12000, usd: 240, state: 'uncommitted' },
  },
  {
    id: '3', code: 'BK-6912', status: 'upcoming', sourceNote: 'Automated Sync', upcomingInDays: 18,
    traveler: { name: 'Nouran El-Gamil', email: 'nouran.gamil@alexandria.edu', note: 'Family Lead (Bivouac)' },
    expedition: { title: 'White Desert', code: 'TRV-9104-EGY', route: 'Chalk Karsts' },
    departure: { from: '2025-12-04', to: '2025-12-07', days: 4, nights: 3 },
    pax: 4, escrow: { egp: 48000, usd: 960, state: 'active' },
  },
  {
    id: '4', code: 'BK-5820', status: 'completed', sourceNote: 'Archived Trail',
    traveler: { name: 'Karim Mostafa', email: 'karim.m@guc.edu.eg', note: 'Verified Checkout' },
    expedition: { title: 'Siwa Oasis', code: 'TRV-9319-EGY', route: 'Desert Base' },
    departure: { from: '2025-10-12', to: '2025-10-17', days: 6, nights: 5 },
    pax: 2, escrow: { egp: 26000, usd: 520, state: 'settled' },
  },
  {
    id: '5', code: 'BK-4921', status: 'cancelled', sourceNote: 'Cancelled',
    traveler: { name: 'Hany Abdel-Rahman', email: 'hany.rahman@gmail.com', note: 'Traveler Self-Cancel' },
    expedition: { title: 'Sinai High', code: 'TRV-8942-EGY', route: 'Bedouin Pass' },
    departure: { from: '2025-11-14', to: '2025-11-18', days: 5, nights: 4 },
    pax: 1, escrow: { egp: 12000, usd: 240, state: 'refunded' },
  },
];

const mockList = (q) => {
  const search = (q.search ?? '').replace('#', '').toLowerCase();
  const filtered = mockItems.filter(
    (b) =>
      (!q.status || q.status === 'all' || b.status === q.status) &&
      (!search || b.code.toLowerCase().includes(search)),
  );
  return Promise.resolve({
    items: filtered,
    total: 34,
    counts: { all: 34, pending: 4, confirmed: 18, upcoming: 8, completed: 3, cancelled: 1 },
  });
};

const mockStats = {
  total: 34, updatedMinutesAgo: 4, pending: 4, pendingExpiringHours: 6,
  confirmedUpcoming: 26, escrowEgp: 184200, escrowUsd: 3780,
};

// NOTE: endpoint paths are assumptions — adjust to match your NestJS controllers.
const qs = (q) =>
  new URLSearchParams(
    Object.entries(q)
      .filter(([, v]) => v !== undefined && v !== '' && v !== 'all')
      .map(([k, v]) => [k, String(v)]),
  ).toString();

export const bookingsService = {
  list: async (q) => {
    try {
      if (MOCK) return await mockList(q);
      return await api(`/operator/bookings?${qs(q)}`);
    } catch {
      return await mockList(q);
    }
  },
  stats: async () => {
    try {
      if (MOCK) return await Promise.resolve(mockStats);
      return await api('/operator/bookings/stats');
    } catch {
      return await Promise.resolve(mockStats);
    }
  },
  confirm: async (id) => {
    try {
      return await api(`/operator/bookings/${id}/confirm`, { method: 'PATCH' });
    } catch {
      return Promise.resolve();
    }
  },
  reject: async (id) => {
    try {
      return await api(`/operator/bookings/${id}/reject`, { method: 'PATCH' });
    } catch {
      return Promise.resolve();
    }
  },
  bulkConfirm: async (ids) => {
    try {
      return await api('/operator/bookings/bulk-confirm', { method: 'POST', body: JSON.stringify({ ids }) });
    } catch {
      return Promise.resolve();
    }
  },
  exportUrl: (format) => `/operator/bookings/export?format=${format}`,
};