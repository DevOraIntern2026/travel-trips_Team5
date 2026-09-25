import { db } from '../../src/prisma/db.js';

type TableName =
  | 'authToken'
  | 'refreshSession'
  | 'user'
  | 'operator'
  | 'tripDate'
  | 'trip'
  | 'destination';

async function clearTable(table: TableName, iterations = 1000) {
  // The ORM .delete() removes a single matching row per call, so loop until
  // the table is empty. Capped as a safety net against infinite loops.
  for (let i = 0; i < iterations; i++) {
    const ns = db.orm.public;
    const deleted =
      table === 'authToken'
        ? await ns.AuthToken.where((t) => t.id.gte(0)).delete()
        : table === 'refreshSession'
          ? await ns.RefreshSession.where((s) => s.id.gte(0)).delete()
          : table === 'user'
            ? await ns.User.where((u) => u.id.gte(0)).delete()
            : table === 'operator'
              ? await ns.Operator.where((o) => o.id.gte(0)).delete()
              : table === 'tripDate'
                ? await ns.TripDate.where((d) => d.id.gte(0)).delete()
                : table === 'trip'
                  ? await ns.Trip.where((t) => t.id.gte(0)).delete()
                  : await ns.Destination.where((d) => d.id.gte(0)).delete();
    if (!deleted || (Array.isArray(deleted) && deleted.length === 0)) {
      return;
    }
  }
  throw new Error(`clearTable(${table}) did not converge`);
}

/**
 * Empty all feature tables. Child-first along every FK chain. Every e2e file
 * calls this in beforeEach so files stay independent regardless of order.
 */
export async function clearAllTables() {
  await clearTable('authToken');
  await clearTable('refreshSession');
  await clearTable('tripDate');
  await clearTable('trip');
  await clearTable('user');
  await clearTable('operator');
  await clearTable('destination');
}
