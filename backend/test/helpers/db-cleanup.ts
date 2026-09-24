import { db } from '../../src/prisma/db.js';

type TableName = 'tripDate' | 'trip' | 'destination';

async function clearTable(table: TableName, iterations = 1000) {
  // The ORM .delete() removes a single matching row per call, so loop until
  // the table is empty. Capped as a safety net against infinite loops.
  for (let i = 0; i < iterations; i++) {
    const deleted =
      table === 'tripDate'
        ? await db.orm.public.TripDate.where((d) => d.id.gte(0)).delete()
        : table === 'trip'
          ? await db.orm.public.Trip.where((t) => t.id.gte(0)).delete()
          : await db.orm.public.Destination.where((d) => d.id.gte(0)).delete();
    if (!deleted || (Array.isArray(deleted) && deleted.length === 0)) {
      return;
    }
  }
  throw new Error(`clearTable(${table}) did not converge`);
}

/**
 * Empty all feature tables. Child-first: tripDate -> trip -> destination,
 * following the FK chain. Every e2e file calls this in beforeEach so files
 * stay independent regardless of execution order.
 */
export async function clearAllTables() {
  await clearTable('tripDate');
  await clearTable('trip');
  await clearTable('destination');
}
