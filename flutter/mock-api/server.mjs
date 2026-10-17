import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(await readFile(join(here, 'data.json'), 'utf8'));
const port = Number(process.env.MOCK_PORT ?? 3000);
const prefix = '/api/v1';

function paginated(items, url) {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.max(1, Number(url.searchParams.get('limit') ?? 10));
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total: items.length, totalPages: items.length ? Math.ceil(items.length / limit) : 0 },
  };
}

function matchesText(trip, query) {
  if (!query) return true;
  const text = [trip.name, trip.description, trip.destination?.name, trip.destination?.city, trip.destination?.country]
    .filter(Boolean).join(' ').toLowerCase();
  return text.includes(query.toLowerCase());
}

function matchingTrips(url, mode) {
  const q = url.searchParams.get(mode === 'list' ? 'search' : 'q')?.trim() ?? '';
  const destinationId = url.searchParams.has('destinationId') ? Number(url.searchParams.get('destinationId')) : null;
  const operatorId = url.searchParams.has('operatorId') ? Number(url.searchParams.get('operatorId')) : null;
  const minDuration = Number(url.searchParams.get('minDuration') ?? 0);
  const maxDuration = Number(url.searchParams.get('maxDuration') ?? Number.MAX_SAFE_INTEGER);
  const minPrice = Number(url.searchParams.get('minPrice') ?? 0);
  const maxPrice = Number(url.searchParams.get('maxPrice') ?? Number.MAX_SAFE_INTEGER);
  const date = url.searchParams.get('date');
  const availableOnly = url.searchParams.get('availableOnly') === 'true';

  const result = fixture.trips.filter((trip) => {
    if (!trip.isActive || !matchesText(trip, q)) return false;
    if (destinationId !== null && trip.destinationId !== destinationId) return false;
    if (operatorId !== null && trip.operatorId !== operatorId) return false;
    if (trip.durationDays < minDuration || trip.durationDays > maxDuration) return false;
    const dates = trip.dates.filter((item) => item.isActive);
    if ((date || minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER || availableOnly) && dates.length === 0) return false;
    const matchingDates = dates.filter((item) => {
      const start = Date.parse(item.startDate);
      const end = Date.parse(item.endDate);
      const dateMatches = !date || (Date.parse(`${date}T00:00:00.000Z`) <= end && Date.parse(`${date}T23:59:59.999Z`) >= start);
      const priceMatches = item.price >= minPrice && item.price <= maxPrice;
      const availabilityMatches = !availableOnly || item.capacity > item.bookedSeats;
      return dateMatches && priceMatches && availabilityMatches;
    });
    return !(date || minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER || availableOnly) || matchingDates.length > 0;
  });

  const sort = url.searchParams.get('sort');
  if (sort === 'price_asc') result.sort((a, b) => Math.min(...a.dates.map((d) => d.price)) - Math.min(...b.dates.map((d) => d.price)));
  if (sort === 'price_desc') result.sort((a, b) => Math.max(...b.dates.map((d) => d.price)) - Math.max(...a.dates.map((d) => d.price)));
  if (sort === 'date_asc') result.sort((a, b) => Math.min(...a.dates.map((d) => Date.parse(d.startDate))) - Math.min(...b.dates.map((d) => Date.parse(d.startDate))));
  return result;
}

function send(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
  });
  response.end(JSON.stringify(payload));
}

const server = createServer((request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204, {});
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const path = url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) || '/' : url.pathname;
  const parts = path.split('/').filter(Boolean);
  if (request.method !== 'GET') return send(response, 405, { message: 'Mock API supports GET only.' });

  if (path === '/health/live') return send(response, 200, { status: 'ok', service: 'mock-api' });
  if (parts[0] === 'destinations' && parts.length === 1) {
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const items = fixture.destinations.filter((item) => `${item.name} ${item.city} ${item.country}`.toLowerCase().includes(search));
    return send(response, 200, paginated(items, url));
  }
  if (parts[0] === 'trips' && parts.length === 1) {
    return send(response, 200, paginated(matchingTrips(url, 'list'), url));
  }
  if (parts[0] === 'trips' && parts[1] === 'search' && parts.length === 2) {
    return send(response, 200, paginated(matchingTrips(url, 'search'), url));
  }
  if (parts[0] === 'trips' && parts[1] === 'filter' && parts.length === 2) {
    return send(response, 200, paginated(matchingTrips(url, 'filter'), url));
  }
  if (parts[0] === 'trips' && parts.length === 2 && /^\d+$/.test(parts[1])) {
    const trip = fixture.trips.find((item) => item.id === Number(parts[1]) && item.isActive);
    return trip ? send(response, 200, trip) : send(response, 404, { message: 'Trip not found.' });
  }
  if (parts[0] === 'trips' && parts.length === 3 && /^\d+$/.test(parts[1]) && parts[2] === 'operator') {
    const trip = fixture.trips.find((item) => item.id === Number(parts[1]));
    const operator = fixture.operators.find((item) => item.id === trip?.operatorId);
    return operator ? send(response, 200, operator) : send(response, 404, { message: 'Operator not found.' });
  }
  if (parts[0] === 'trips' && parts.length === 3 && /^\d+$/.test(parts[1]) && parts[2] === 'dates') {
    const trip = fixture.trips.find((item) => item.id === Number(parts[1]) && item.isActive);
    return trip ? send(response, 200, paginated(trip.dates.filter((item) => item.isActive), url)) : send(response, 404, { message: 'Trip not found.' });
  }
  if (parts[0] === 'trips' && parts.length === 5 && /^\d+$/.test(parts[1]) && parts[2] === 'dates' && /^\d+$/.test(parts[3]) && parts[4] === 'availability') {
    const trip = fixture.trips.find((item) => item.id === Number(parts[1]));
    const date = trip?.dates.find((item) => item.id === Number(parts[3]) && item.isActive);
    if (!date) return send(response, 404, { message: 'Trip date not found.' });
    const remainingSeats = Math.max(0, date.capacity - date.bookedSeats);
    return send(response, 200, { tripId: trip.id, dateId: date.id, capacity: date.capacity, bookedSeats: date.bookedSeats, remainingSeats, available: remainingSeats > 0 });
  }
  return send(response, 404, { message: 'Mock route not found.' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`TravelOra mock API listening on http://0.0.0.0:${port}${prefix}`);
  console.log('Stop it with Ctrl+C. Use this server instead of the backend while previewing mock data.');
});
